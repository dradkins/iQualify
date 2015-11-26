using IQualify.Contract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using IQualify.Web.API.Models;

namespace IQualify.Web.API.Controllers
{
    [Authorize]
    public class AnswersController : BaseAPIController
    {
        public AnswersController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpPost]
        public async Task<IHttpActionResult> CheckQuestionAnswer(CheckAnswerModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data entered");
                }
                var question = await _Uow._Questions.GetByIdAsync(model.QuestionId);
                var answerStatus=new AnswerStatusModel();
                if (question == null)
                {
                    return NotFound();
                }
                if (question.CorrectAnswer == model.SelectedAnswer)
                {
                    answerStatus.IsCorrect=true;
                    return Ok(answerStatus);
                }
                answerStatus.IsCorrect = false;
                answerStatus.CorrectAnswer = question.CorrectAnswer;
                answerStatus.Reason = question.Reason ?? "";
                return Ok(answerStatus);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
