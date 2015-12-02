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
                    URLLink=URLHelper.URLFriendly(x.Name)
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
                var topicalExamViewModel = new List<TopicalExamQuestionViewModel>();
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
                questions.ForEach(x => topicalExamViewModel.Add(new TopicalExamQuestionViewModel
                {
                    Id = x.Id,
                    QuestionImage = x.Image,
                    NoOfOptions = x.NoOfOptions
                }));
                return Ok(topicalExamViewModel);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
