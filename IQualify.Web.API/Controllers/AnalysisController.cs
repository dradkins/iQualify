using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using IQualify.Contract;
using IQualify.Web.API.Models;
using IQualify.EF;

namespace IQualify.Web.API.Controllers
{
    [RoutePrefix("api/Analysis")]
    public class AnalysisController : BaseAPIController
    {
        public AnalysisController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetYearlyExamAnalysis")]
        public async Task<IHttpActionResult> GetYearlyExamAnalysis(int subjectId)
        {
            try
            {
                YearlyExamAnalysisViewModel model = new YearlyExamAnalysisViewModel();

                var studentId = User.Identity.GetUserId();
                var yearlyExams = await _Uow._StudentExam
                    .GetAll(x => x.ExamTypeId == (int)ExamTypeEnum.YearlyExam && x.StudentId == studentId && x.SubjectId == subjectId)
                    .OrderBy(x => x.ExamDateTime)
                    .ToListAsync();

                foreach (var item in yearlyExams)
                {
                    model.Percentage.Add(item.Percentage.GetValueOrDefault());
                    model.Performance.Add(model.Percentage.Sum(x => x) / model.Percentage.Count);
                }

                model.LastExamPerformance = model.Performance.LastOrDefault();
                model.LastPerformanceStatus = model.LastExamPerformance - ((model.Performance.Count > 1) ? model.Performance[model.Performance.Count - 2] : 0);

                var lastExam = await _Uow._StudentExam
                    .GetAll(x => x.ExamTypeId == (int)ExamTypeEnum.YearlyExam && x.StudentId == studentId && x.SubjectId == subjectId)
                    .OrderByDescending(x => x.ExamDateTime)
                    .Include(x => x.Subject)
                    .Include(x => x.StudentYearlyExams)
                    .Include(x => x.StudentYearlyExams.Select(y => y.YearlyExam))
                    .FirstOrDefaultAsync();

                var lastExamResult = new YearlyExamResultViewModel();

                lastExamResult.CorrectAnswers = lastExam.CorrectAnswers.GetValueOrDefault();
                lastExamResult.ExamDateTime = lastExam.ExamDateTime.GetValueOrDefault();
                lastExamResult.ExpectedGrade = GetExpectedGrade(lastExam, lastExam.StudentYearlyExams.FirstOrDefault().YearlyExam);
                lastExamResult.Id = lastExam.Id;
                lastExamResult.Percentage = lastExam.Percentage.GetValueOrDefault();
                lastExamResult.TimeTaken = lastExam.TimeTaken.GetValueOrDefault();
                lastExamResult.TotalQuestions = lastExam.TotalQuestions.GetValueOrDefault();
                lastExamResult.YearlyExam = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(lastExam.StudentYearlyExams.FirstOrDefault().YearlyExam.ExamMonth.GetValueOrDefault()) + " " + lastExam.StudentYearlyExams.FirstOrDefault().YearlyExam.ExamYear.GetValueOrDefault();
                lastExamResult.Subject = new UserSubjectModel
                {
                    SubjectName = lastExam.Subject.Name
                };

                model.LastExamResult = lastExamResult;

                return Ok(model);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        #region Helpers

        private string GetExpectedGrade(StudentExam examResult, YearlyExam yearlyExam)
        {
            if (examResult.Percentage >= yearlyExam.AGradePercent)
            {
                return "A";
            }
            else if (examResult.Percentage >= yearlyExam.BGradePercent)
            {
                return "B";
            }
            else if (examResult.Percentage >= yearlyExam.CGradePercent)
            {
                return "C";
            }
            else if (examResult.Percentage >= yearlyExam.DGradePercent)
            {
                return "D";
            }
            else if (examResult.Percentage >= yearlyExam.EGradePercent)
            {
                return "E";
            }
            else
            {
                return "F";
            }
        }

        #endregion
    }
}
