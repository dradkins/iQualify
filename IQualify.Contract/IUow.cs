using IQualify.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IQualify.Contract
{
    public interface IUow : IDisposable
    {
        #region Methods

        Task CommitAsync();

        #endregion

        #region Repositories

        IRepository<Subject> _Subjects { get; }

        IRepository<StudentSubject> _StudentSubjects { get; }
        IRepository<Question> _Questions { get; }

        #endregion
    }
}
