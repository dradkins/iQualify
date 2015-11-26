//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IQualify.EF
{
    using System;
    using System.Collections.Generic;
    
    public partial class Subject
    {
        public Subject()
        {
            this.StudentExams = new HashSet<StudentExam>();
            this.StudentExams1 = new HashSet<StudentExam>();
            this.StudentSubjects = new HashSet<StudentSubject>();
            this.StudentSubjects1 = new HashSet<StudentSubject>();
            this.Topics = new HashSet<Topic>();
            this.Topics1 = new HashSet<Topic>();
            this.YearlyExams = new HashSet<YearlyExam>();
            this.YearlyExams1 = new HashSet<YearlyExam>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string SubjectCode { get; set; }
        public Nullable<int> SubjectClass { get; set; }
        public Nullable<int> SubjectType { get; set; }
        public string SubjectDescription { get; set; }
        public bool Active { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual AspNetUser AspNetUser1 { get; set; }
        public virtual AspNetUser AspNetUser2 { get; set; }
        public virtual AspNetUser AspNetUser3 { get; set; }
        public virtual ICollection<StudentExam> StudentExams { get; set; }
        public virtual ICollection<StudentExam> StudentExams1 { get; set; }
        public virtual ICollection<StudentSubject> StudentSubjects { get; set; }
        public virtual ICollection<StudentSubject> StudentSubjects1 { get; set; }
        public virtual ICollection<Topic> Topics { get; set; }
        public virtual ICollection<Topic> Topics1 { get; set; }
        public virtual ICollection<YearlyExam> YearlyExams { get; set; }
        public virtual ICollection<YearlyExam> YearlyExams1 { get; set; }
    }
}
