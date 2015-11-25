using IQualify.Contract;
using IQualify.Web.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using IQualify.EF;

namespace IQualify.Web.API.Controllers
{
    [RoutePrefix("api/Subject")]
    public class SubjectController : BaseAPIController
    {
        public SubjectController(IUow uow)
        {
            _Uow = uow;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IHttpActionResult> GetAll(int subjectClass, int subjectType)
        {
            try
            {
                var subjectsList = new List<UserSubjectModel>();
                var subjects = await _Uow._Subjects
                    .GetAll(s => s.SubjectClass == subjectClass && s.SubjectType == subjectType)
                    .ToListAsync();

                if (subjects != null)
                {
                    subjects.ForEach(s =>
                        subjectsList.Add(new UserSubjectModel
                        {
                            SubjectClass=s.SubjectClass.GetValueOrDefault(),
                            SubjectCode=s.SubjectCode,
                            SubjectId=s.Id,
                            SubjectName=s.Name,
                            SubjectType=s.SubjectType.GetValueOrDefault()
                        })
                    );
                }
                return Ok(subjectsList);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("SaveUserSubjects")]
        public async Task<IHttpActionResult> SaveUserSubjects(List<int> Id)
        {
            try
            {
                var userId = User.Identity.GetUserId();

                foreach (var item in Id)
                {
                    _Uow._StudentSubjects.Add(new StudentSubject
                    {
                        Active = true,
                        CreatedBy = userId,
                        CreatedOn = DateTime.UtcNow,
                        StudentId = userId,
                        SubjectId = item
                    });
                }
                await _Uow.CommitAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
