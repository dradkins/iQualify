using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{

    public class YearlyExamQuestionViewModel
    {
        public int Id { get; set; }
        public int NoOfOptions { get; set; }
        public string QuestionImage { get; set; }
        public string Topic { get; set; }
        public string CorrectAnswer { get; set; }
    }

    public class YearlyExamsViewModel
    {
        public int Id { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int Duration { get; set; }
        public string Title { get; set; }
    }

    public class YearlyExamStartingViewModel
    {
        public YearlyExamStartingViewModel()
        {
            YearlyExamQuestions = new List<YearlyExamQuestionViewModel>();
        }

        public DateTime ExamStartingTime { get { return DateTime.UtcNow; } }
        public int Duration { get; set; }
        public List<YearlyExamQuestionViewModel> YearlyExamQuestions { get; set; }
    }

    public class YearlyExamSubmissionViewModel
    {
        public YearlyExamSubmissionViewModel()
        {
            SelectedAnswers = new List<YearlyExamAnswersViewModel>();
        }

        [Required]
        public List<YearlyExamAnswersViewModel> SelectedAnswers { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public DateTime ExamStartingTime { get; set; }

        [Required]
        public int YearlyExamId { get; set; }
    }

    public class YearlyExamAnswersViewModel
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string SelectedAnswer { get; set; }
    }

    public class YearlyExamResultViewModel
    {
        public YearlyExamResultViewModel()
        {
            Subject = new UserSubjectModel();
        }
        public int Id { get; set; }
        public UserSubjectModel Subject { get; set; }
        public DateTime ExamDateTime { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Percentage { get; set; }
        public int TimeTaken { get; set; }
        public string ExpectedGrade { get; set; }
        public string YearlyExam { get; set; }
    }
}