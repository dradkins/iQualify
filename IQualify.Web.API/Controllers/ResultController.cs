using IQualify.Contract;
using IQualify.Web.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using IQualify.EF;

namespace IQualify.Web.API.Controllers
{
    [RoutePrefix("api/Result")]
    public class ResultController : BaseAPIController
    {

        public ResultController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetTopicalExamResult")]
        public async Task<IHttpActionResult> GetTopicalExamResult(int id)
        {
            try
            {
                var examResult = await _Uow._StudentExam.GetAll(x => x.Id == id)
                    .Include(x => x.StudentTopicalExams)
                    .Include(x => x.Subject)
                    .Include(x => x.StudentTopicalExams.Select(y => y.Topic))
                    .FirstOrDefaultAsync();
                if (examResult == null)
                {
                    return NotFound();
                }
                if (examResult.StudentId != User.Identity.GetUserId())
                {
                    return BadRequest("You are not allowed to see that result");
                }

                var topicalExamResult = new TopicalExamResultViewModel();
                topicalExamResult.CorrectAnswers = examResult.CorrectAnswers.GetValueOrDefault();
                topicalExamResult.ExamDateTime = examResult.ExamDateTime.GetValueOrDefault();
                topicalExamResult.Percentage = examResult.Percentage.GetValueOrDefault();
                topicalExamResult.Subject.SubjectId = examResult.Subject.Id;
                topicalExamResult.Subject.SubjectName = examResult.Subject.Name;
                topicalExamResult.TimeTaken = examResult.TimeTaken.GetValueOrDefault();
                topicalExamResult.Topic.TopicId = examResult.StudentTopicalExams.FirstOrDefault().Topic.Id;
                topicalExamResult.Topic.Name = examResult.StudentTopicalExams.FirstOrDefault().Topic.Name;
                topicalExamResult.TotalQuestions = examResult.TotalQuestions.GetValueOrDefault();
                return Ok(topicalExamResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("GetYEarlyExamResult")]
        public async Task<IHttpActionResult> GetYEarlyExamResult(int id)
        {
            try
            {
                var examResult = await _Uow._StudentExam.GetAll(x => x.Id == id)
                    .Include(x => x.StudentYearlyExams)
                    .Include(x => x.Subject)
                    .Include(x => x.StudentYearlyExams.Select(y => y.YearlyExam))
                    .FirstOrDefaultAsync();
                if (examResult == null)
                {
                    return NotFound();
                }
                if (examResult.StudentId != User.Identity.GetUserId())
                {
                    return BadRequest("You are not allowed to see that result");
                }

                var yearlyExamResult = new YearlyExamResultViewModel();
                yearlyExamResult.CorrectAnswers = examResult.CorrectAnswers.GetValueOrDefault();
                yearlyExamResult.ExamDateTime = examResult.ExamDateTime.GetValueOrDefault();
                yearlyExamResult.Percentage = examResult.Percentage.GetValueOrDefault();
                yearlyExamResult.Subject.SubjectId = examResult.Subject.Id;
                yearlyExamResult.Subject.SubjectName = examResult.Subject.Name;
                yearlyExamResult.TimeTaken = examResult.TimeTaken.GetValueOrDefault();

                var yearlyExam = examResult.StudentYearlyExams.FirstOrDefault().YearlyExam;

                yearlyExamResult.YearlyExam = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(yearlyExam.ExamMonth.GetValueOrDefault()) + " " + yearlyExam.ExamYear.GetValueOrDefault();

                yearlyExamResult.ExpectedGrade = GetExpectedGrade(examResult, yearlyExam);

                yearlyExamResult.TotalQuestions = examResult.TotalQuestions.GetValueOrDefault();
                return Ok(yearlyExamResult);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("GetYearlyExamResultHistory")]
        public async Task<IHttpActionResult> GetYearlyExamResultHistory()
        {
            try
            {
                var examsList = new List<YearlyExamResultViewModel>();
                var yearlyExamResults = await _Uow._StudentExam
                    .GetAll(x => x.ExamTypeId == (int)ExamTypeEnum.YearlyExam)
                    .ToListAsync();

                foreach (var item in yearlyExamResults)
                {
                    examsList.Add(new YearlyExamResultViewModel
                    {
                        Id = item.Id,
                        ExamDateTime = item.ExamDateTime.GetValueOrDefault(),
                        Percentage = item.Percentage.GetValueOrDefault(),
                        TimeTaken = item.TimeTaken.GetValueOrDefault()
                    });
                }
                return Ok(examsList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("GetTopicalExamResultHistory")]
        public async Task<IHttpActionResult> GetTopicalExamResultHistory()
        {
            try
            {
                var examsList = new List<YearlyExamResultViewModel>();
                var yearlyExamResults = await _Uow._StudentExam
                    .GetAll(x => x.ExamTypeId == (int)ExamTypeEnum.TopicalExam)
                    .ToListAsync();

                foreach (var item in yearlyExamResults)
                {
                    examsList.Add(new YearlyExamResultViewModel
                    {
                        Id = item.Id,
                        ExamDateTime = item.ExamDateTime.GetValueOrDefault(),
                        Percentage = item.Percentage.GetValueOrDefault(),
                        TimeTaken = item.TimeTaken.GetValueOrDefault()
                    });
                }
                return Ok(examsList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        #region Helpers

        private string GetExpectedGrade(StudentExam examResult, YearlyExam yearlyExam)
        {
            if (examResult.Percentage >= yearlyExam.AGradePercent)
            {
                return "A";
            }
            else if (examResult.Percentage >= yearlyExam.BGradePercent)
            {
                return "B";
            }
            else if (examResult.Percentage >= yearlyExam.CGradePercent)
            {
                return "C";
            }
            else if (examResult.Percentage >= yearlyExam.DGradePercent)
            {
                return "D";
            }
            else if (examResult.Percentage >= yearlyExam.EGradePercent)
            {
                return "E";
            }
            else
            {
                return "F";
            }
        }

        #endregion
    }
}
