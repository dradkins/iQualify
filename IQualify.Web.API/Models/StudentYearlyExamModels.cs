using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{
    public class YearlyExamQuestionViewModel
    {
        public int Id { get; set; }
        public int NoOfOptions { get; set; }
        public string ImageData { get; set; }
    }

    public class YearlyQuestioneerViewModel
    {
        public int QuestionId { get; set; }
        public string SelectedOption { get; set; }
    }

    public class StudentYearlyExamViewModel
    {
        public StudentYearlyExamViewModel()
        {
            ExamQuestions = new List<YearlyQuestioneerViewModel>();
        }

        public int YearlyExamId { get; set; }
        public List<YearlyQuestioneerViewModel> ExamQuestions { get; set; }
    }

    public class YearlyExamResultViewModel
    {
        public int NoOfCorrectAnswers { get; set; }
        public int NoOfWrongAnswers { get; set; }
        public int TotalTime { get; set; }
        public int TimeTaken { get; set; }
        public string GradeObtained { get; set; }
    }
}