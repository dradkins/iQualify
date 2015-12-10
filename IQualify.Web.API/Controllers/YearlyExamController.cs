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
    [RoutePrefix("api/YearlyExam")]
    public class YearlyExamController : BaseAPIController
    {
        public YearlyExamController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetSubjectYearlyExams")]
        public async Task<IHttpActionResult> GetSubjectYearlyExams(int subjectId)
        {
            try
            {
                var yearlyExamsViewModelList = new List<YearlyExamsViewModel>();
                var subjectYearlyExams = await _Uow._YearlyExams
                    .GetAll(x => x.SubjectId == subjectId && x.Active == true)
                    .Select(x => new
                    {
                        Id = x.Id,
                        Year = x.ExamYear,
                        Month = x.ExamMonth,
                        Duration = x.Duration
                    })
                    .ToListAsync();

                if (subjectYearlyExams == null)
                {
                    return NotFound();
                }
                subjectYearlyExams.ForEach(x => yearlyExamsViewModelList.Add(new YearlyExamsViewModel
                {
                    Id = x.Id,
                    Year = x.Year.GetValueOrDefault(),
                    Month = x.Month.GetValueOrDefault(),
                    Duration = x.Duration.GetValueOrDefault(),
                    Title = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(x.Month.GetValueOrDefault()) + " - " + x.Year.GetValueOrDefault() + "   (" + x.Duration.GetValueOrDefault() + " Min.)"
                }));
                return Ok(yearlyExamsViewModelList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("GetYearlyExamQuestions")]
        public async Task<IHttpActionResult> GetYearlyExamQuestions(int yearlyExamId)
        {
            try
            {
                var yearlyExamViewModel = new YearlyExamStartingViewModel();
                var yearlyExamQuestions = new List<YearlyExamQuestionViewModel>();
                var questions = await _Uow._YearlyExamQuestions
                    .GetAll(x => x.YearlyExamId == yearlyExamId)
                    .Include(x => x.YearlyExam)
                    .OrderBy(x => x.QuestionOrder)
                    .Include(x => x.Question)
                    .Select(x => new
                    {
                        Id = x.Question.Id,
                        Image = x.Question.QuestionData,
                        NoOfOptions = x.Question.NoOfOptions ?? 4,
                        QuestionOrder = x.QuestionOrder,
                        CorrectAnswer = x.Question.CorrectAnswer,
                        Duration = x.YearlyExam.Duration,
                    })
                    .ToListAsync();
                if (questions == null)
                {
                    return NotFound();
                }
                foreach (var item in questions)
                {
                    var yeqModel = new YearlyExamQuestionViewModel();
                    yeqModel.Id = item.Id;
                    yeqModel.QuestionImage = item.Image;
                    yeqModel.NoOfOptions = item.NoOfOptions;
                    yeqModel.CorrectAnswer = item.CorrectAnswer;
                    var questionTopic = _Uow._QuestionTopics.GetAll(x => x.QuestionId == item.Id).Include(x=>x.Topic).Select(x=>x.Topic).FirstOrDefault();
                    if (questionTopic != null)
                    {
                        yeqModel.Topic = questionTopic.Name;
                    }
                    else
                    {
                        yeqModel.Topic = "";
                    }
                    yearlyExamQuestions.Add(yeqModel);

                }
                yearlyExamViewModel.YearlyExamQuestions = yearlyExamQuestions;
                yearlyExamViewModel.Duration = questions.FirstOrDefault().Duration.GetValueOrDefault();
                return Ok(yearlyExamViewModel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("SaveExam")]
        public async Task<IHttpActionResult> SaveExam(YearlyExamSubmissionViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please verify exam and submit again");
            }
            try
            {
                var yearlyExam = await _Uow._YearlyExams.GetByIdAsync(model.YearlyExamId);
                if (yearlyExam == null)
                {
                    return NotFound();
                }

                var totalTimeTaken = (DateTime.UtcNow - model.ExamStartingTime).Minutes;
                if (totalTimeTaken > yearlyExam.Duration)
                {
                    return BadRequest("Time exceeds to allowed time");
                }

                var studentExam = new StudentExam();
                studentExam.ExamDateTime = model.ExamStartingTime;
                studentExam.ExamTypeId = (int)ExamTypeEnum.YearlyExam;
                studentExam.StudentId = User.Identity.GetUserId();
                studentExam.SubjectId = model.SubjectId;
                studentExam.TimeTaken = (int)Math.Round((DateTime.UtcNow - model.ExamStartingTime).TotalMinutes);
                studentExam.TotalQuestions = model.SelectedAnswers.Count;
                studentExam.WrongAnswers = 0;
                studentExam.CorrectAnswers = 0;
                studentExam.StudentExamDetails = new List<StudentExamDetail>();

                foreach (var item in model.SelectedAnswers)
                {
                    var question = await _Uow._Questions.GetByIdAsync(item.QuestionId);

                    if (question != null)
                    {
                        studentExam.StudentExamDetails.Add(new StudentExamDetail
                            {
                                CorrectAnswer = question.CorrectAnswer,
                                QuestionId = item.QuestionId,
                                SelectedAnswer = item.SelectedAnswer,
                            });
                        if (item.SelectedAnswer == question.CorrectAnswer)
                        {
                            studentExam.CorrectAnswers += 1;
                        }
                        else
                        {
                            studentExam.WrongAnswers += 1;
                        }
                    }
                }
                studentExam.Percentage = (studentExam.CorrectAnswers / (double)studentExam.TotalQuestions) * 100.0;
                studentExam.MarksObtained = 0;
                studentExam.StudentTopicalExams = new List<StudentTopicalExam>();
                studentExam.StudentYearlyExams.Add(new StudentYearlyExam
                {
                    YearlyExamId = model.YearlyExamId
                });

                _Uow._StudentExam.Add(studentExam);
                await _Uow.CommitAsync();
                return Ok(studentExam.Id);
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

                yearlyExamResult.ExpectedGrade = GetExpectedGrade(examResult, yearlyExam);

                yearlyExamResult.TotalQuestions = examResult.TotalQuestions.GetValueOrDefault();
                return Ok(yearlyExamResult);
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
