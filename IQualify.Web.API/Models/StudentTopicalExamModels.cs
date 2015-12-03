using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

    public class TopicalExamStartingViewModel
    {
        public TopicalExamStartingViewModel()
        {
            TopicalExamQuestions = new List<TopicalExamQuestionViewModel>();
        }
        public DateTime ExamStartingTime { get { return DateTime.UtcNow; } }
        public List<TopicalExamQuestionViewModel> TopicalExamQuestions { get; set; }
    }

    public class TopicalExamSubmissionViewModel
    {
        public TopicalExamSubmissionViewModel()
        {
            SelectedAnswers = new List<TopicalExamAnswersViewModel>();
        }

        [Required]
        public List<TopicalExamAnswersViewModel> SelectedAnswers { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public DateTime ExamStartingTime { get; set; }

        [Required]
        public int TopicId { get; set; }
    }

    public class TopicalExamAnswersViewModel
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public string SelectedAnswer { get; set; }
    }

    public class TopicalExamResultViewModel
    {
        public TopicalExamResultViewModel()
        {
            Subject = new UserSubjectModel();
            Topic = new TopicsViewModel();
        }

        public UserSubjectModel Subject { get; set; }
        public TopicsViewModel Topic { get; set; }
        public DateTime ExamDateTime { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Percentage { get; set; }
        public int TimeTaken { get; set; }
    }
}