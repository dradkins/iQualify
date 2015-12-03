using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using IQualify.Contract;
using IQualify.EF;
using IQualify.Web.API.Models;
using System.Threading.Tasks;
using IQualify.Web.API.Helpers;

namespace IQualify.Web.API.Controllers
{
    [RoutePrefix("api/TopicalExam")]
    public class TopicalExamController : BaseAPIController
    {

        public TopicalExamController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetSubjectTopics")]
        public async Task<IHttpActionResult> GetSubjectTopics(int subjectId)
        {
            try
            {
                var topicViewModel = new List<TopicsViewModel>();
                var subjectTopics = await _Uow._Topics
                    .GetAll(x => x.SubjectId == subjectId && x.Active == true)
                    .Include(x => x.QuestionTopics)
                    .Select(x => new
                    {
                        Id = x.Id,
                        Name = x.Name,
                        NoOfQuestions = x.QuestionTopics.Count
                    })
                    .ToListAsync();

                if (subjectTopics == null)
                {
                    return NotFound();
                }
                subjectTopics.ForEach(x => topicViewModel.Add(new TopicsViewModel
                {
                    TopicId = x.Id,
                    NoOfQuestion = x.NoOfQuestions,
                    Name = x.Name,
                    URLLink = URLHelper.URLFriendly(x.Name)
                }));
                return Ok(topicViewModel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("GetTopicalExamQuestions")]
        public async Task<IHttpActionResult> GetTopicalExamQuestions(int topicId, int totalQuestions)
        {
            try
            {
                var topicalExamViewModel = new TopicalExamStartingViewModel();
                var topicalExamQuestions = new List<TopicalExamQuestionViewModel>();
                var questions = await _Uow._QuestionTopics
                    .GetAll(x => x.TopicId == topicId)
                    .OrderBy(x => Guid.NewGuid())
                    .Take(totalQuestions)
                    .Include(x => x.Question)
                    .Select(x => new
                    {
                        Id = x.Question.Id,
                        Image = x.Question.QuestionData,
                        NoOfOptions = x.Question.NoOfOptions ?? 4
                    })
                    .ToListAsync();
                if (questions == null)
                {
                    return NotFound();
                }
                questions.ForEach(x => topicalExamQuestions.Add(new TopicalExamQuestionViewModel
                {
                    Id = x.Id,
                    QuestionImage = x.Image,
                    NoOfOptions = x.NoOfOptions
                }));
                topicalExamViewModel.TopicalExamQuestions = topicalExamQuestions;
                return Ok(topicalExamViewModel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("SaveExam")]
        public async Task<IHttpActionResult> SaveExam(TopicalExamSubmissionViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please verify exam and submit again");
            }
            try
            {
                var studentExam = new StudentExam();
                studentExam.ExamDateTime = model.ExamStartingTime;
                studentExam.ExamTypeId = (int)ExamTypeEnum.TopicalExam;
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
                studentExam.StudentTopicalExams.Add(new StudentTopicalExam
                {
                    TopicId = model.TopicId,
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

    }
}
