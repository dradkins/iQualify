using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Data.Entity;
using System.Threading.Tasks;
using IQualify.Contract;
using IQualify.Web.API.Models;

namespace IQualify.Web.API.Controllers
{
    [Authorize]
    [RoutePrefix("api/Questions")]
    public class QuestionsController : BaseAPIController
    {
        public QuestionsController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetRandomQuestions")]
        public async Task<IHttpActionResult> GetRandomQuestions(int id)
        {
            try
            {
                var questionsList = new List<PreparationQuestionsModel>();
                var questions = await _Uow._Questions.GetAll(q => q.Active == true).OrderBy(q => Guid.NewGuid()).Take(id).ToListAsync();

                if (questions != null)
                {
                    questions.ForEach(q =>
                        questionsList.Add(new PreparationQuestionsModel
                        {
                            Id = q.Id,
                            QuestionImage = q.QuestionData,
                            IsCorrectAnswered = false,
                            NoOfOptions = q.NoOfOptions.GetValueOrDefault()

                        })
                    );
                }
                return Ok(questionsList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
