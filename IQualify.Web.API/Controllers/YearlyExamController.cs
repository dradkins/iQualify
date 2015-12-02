using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using IQualify.Contract;
using IQualify.Web.API.Models;
using System.Threading.Tasks;
using IQualify.EF;

namespace IQualify.Web.API.Controllers
{
    public class YearlyExamController : BaseAPIController
    {
        public YearlyExamController(IUow uow)
        {
            _Uow = uow;
        }

        public async Task<IHttpActionResult> GetExamYearsAndMonths(int id)
        {
            try
            {
                var yearlyExams = await _Uow._YearlyExams
                    .GetAll(x => x.Active == true && x.SubjectId == id)
                    .Select(x => new
                    {
                        Id = x.Id,
                        Month = x.ExamMonth,
                        Year = x.ExamYear
                    }).ToListAsync();
                return Ok(yearlyExams);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public async Task<IHttpActionResult> GetYearlyExam(int id)
        {
            try
            {
                var yearlyExam = await _Uow._YearlyExams.GetByIdAsync(id);
                if (yearlyExam == null)
                {
                    return NotFound();
                }
                var isUserAccessExam = await IsUserAccessSubject(yearlyExam.SubjectId.GetValueOrDefault());
                if (!isUserAccessExam)
                {
                    return BadRequest("You are not allowed to visit this exam");
                }
                var yearlyExamQuestions = await _Uow._YearlyExams
                    .GetAll(x => x.Id == id)
                    .Include(x => x.YearlyExamQuestions)
                    .Include(x => x.YearlyExamQuestions.Select(y => y.Question))
                    .FirstOrDefaultAsync();

                var yearlyQuestionsModel = new List<YearlyExamQuestionViewModel>();

                foreach (var item in yearlyExamQuestions.YearlyExamQuestions.OrderBy(y => y.QuestionOrder))
                {
                    if (item.Question.Active)
                    {
                        yearlyQuestionsModel.Add(new YearlyExamQuestionViewModel
                        {
                            Id = item.Question.Id,
                            ImageData = item.Question.QuestionData,
                            NoOfOptions = item.Question.NoOfOptions.GetValueOrDefault()
                        });
                    }
                }
                return Ok(yearlyQuestionsModel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public async Task<IHttpActionResult> FinishExam(StudentYearlyExamViewModel model)
        {
            try
            {
                if (model.ExamQuestions.Any(y => y.SelectedOption == null))
                {
                    return BadRequest("Please attempt all questions and try again");
                }

                var yearlyExam = await _Uow._YearlyExams.GetByIdAsync(model.YearlyExamId);
                StudentExam sExam = new StudentExam();
                sExam.ExamDateTime = DateTime.Now;
                sExam.ExamTypeId = (int)ExamTypeEnum.YearlyExam;
                sExam.StudentId = User.Identity.GetUserId();
                sExam.SubjectId = yearlyExam.SubjectId;
                //sExam.TotalQuestions=model.
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        private async Task<bool> IsUserAccessSubject(int subjectId)
        {
            var userId = User.Identity.GetUserId();
            return await _Uow._StudentSubjects.GetAll(x => x.SubjectId == subjectId && x.StudentId == userId).AnyAsync();
        }
    }
}
