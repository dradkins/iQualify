using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{
    public class CheckAnswerModel
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string SelectedAnswer { get; set; }
    }

    public class AnswerStatusModel
    {
        public bool IsCorrect { get; set; }
        public string CorrectAnswer { get; set; }
        public string Reason { get; set; }
    }
}