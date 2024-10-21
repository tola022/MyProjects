using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RacingAPI.Helpers
{
    public class PaginationSet<T>
    {
        public int PageIndex { set; get; }
        public string SortColumn { set; get; }
        public string SortDirection { set; get; }
        public int PageSize { get; set; }
        public int TotalRows { set; get; }
        public IEnumerable<T> Items { set; get; }
        public object OtherInfo { set; get; } // Can be used for any other object will be mapped here.
    }
}
