using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{

    public class TopicsViewModel
    {
        public int TopicId { get; set; }
        public int NoOfQuestion { get; set; }
        public string Name { get; set; }
        public string URLLink { get; set; }
    }

    public class TopicalExamQuestionViewModel
    {
        public int Id { get; set; }
        public int NoOfOptions { get; set; }
        public string QuestionImage { get; set; }
    }
}