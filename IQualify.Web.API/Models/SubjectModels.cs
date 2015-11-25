using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IQualify.Web.API.Models
{

    public enum SubjectType
    {
        IGSCE = 1,
        GCE = 2
    };

    public enum SubjectClass
    {
        OLevel = 1,
        A1Level1 = 2,
        A2Level = 3
    };

    public class FilterSubject
    {
        public int SubjectType { get; set; }
        public int SubjectClass { get; set; }
    }

    public class UserSubjectModel
    {
        public int SubjectId { get; set; }
        public string SubjectName { get; set; }
        public int SubjectType { get; set; }
        public int SubjectClass { get; set; }
        public string SubjectCode { get; set; }
    }
}