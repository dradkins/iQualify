using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{
    public class PreparationQuestionsModel
    {
        public int Id { get; set; }
        public string QuestionImage { get; set; }
        public int NoOfOptions { get; set; }
        public bool IsCorrectAnswered { get; set; }
    }
}