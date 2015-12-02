using IQualify.Contract;
using IQualify.EF;
using IQualify.Data.Helpers;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DrNajeeb.Data
{
    public class Uow : IUow
    {
        #region Class Members

        protected IRepositoryProvider _RepositoryProvider { get; set; }

        private iQualifyDBEntities _DbContext { get; set; }


        #endregion

        #region Constructor

        public Uow(IRepositoryProvider repositoryProvider)
        {
            CreateDbContext();

            repositoryProvider._DbContext = _DbContext;
            _RepositoryProvider = repositoryProvider;
        }

        #endregion

        #region Repositories

        #region Generic repositories

        public IRepository<Subject> _Subjects { get { return GetStandardRepo<Subject>(); } }
        public IRepository<StudentSubject> _StudentSubjects { get { return GetStandardRepo<StudentSubject>(); } }
        public IRepository<Question> _Questions { get { return GetStandardRepo<Question>(); } }
        public IRepository<YearlyExam> _YearlyExams { get { return GetStandardRepo<YearlyExam>(); } }
        public IRepository<StudentExam> _StudentExam { get { return GetStandardRepo<StudentExam>(); } }
        public IRepository<QuestionTopic> _QuestionTopics { get { return GetStandardRepo<QuestionTopic>(); } }
        public IRepository<Topic> _Topics { get { return GetStandardRepo<Topic>(); } }

        #endregion

        #region Specific Repositories

        //public IOrderRepository _Orders { get { return GetRepo<IOrderRepository>(); } }

        #endregion

        #endregion

        #region Class Methods

        private void CreateDbContext()
        {
            this._DbContext = new iQualifyDBEntities();

            // Do NOT enable proxied entities, else serialization fails
            _DbContext.Configuration.ProxyCreationEnabled = false;

            // Load navigation properties explicitly (avoid serialization trouble)
            _DbContext.Configuration.LazyLoadingEnabled = false;

            // Because We perform validation, we don't need/want EF to do so
            _DbContext.Configuration.ValidateOnSaveEnabled = false;
        }

        private IRepository<T> GetStandardRepo<T>() where T : class
        {
            return _RepositoryProvider.GetRepositoryForEntityType<T>();
        }

        private T GetRepo<T>() where T : class
        {
            return _RepositoryProvider.GetRepository<T>();
        }

        #endregion

        #region Interface Implementation

        public async Task CommitAsync()
        {
            await _DbContext.SaveChangesAsync();
        }

        #region Garbage Collector

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_DbContext != null)
                {
                    _DbContext.Dispose();
                }
            }
        }
        #endregion

        #endregion
    }
}
