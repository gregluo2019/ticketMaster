using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Forum.Data.DataTransferObjects
{
    public interface IVpResponse
    {
        bool Success { get; set; }
        string Message { get; set; }
        object Data { get; set; }
        string DataType { get; set; }
    }

    public class VpResponse : IVpResponse
    {
        public const string NOT_FOUND = "NOT FOUND";
        public bool Success { get; set; } = true;
        public string Message { get; set; } = "";
        public object Data { get; set; } = null;
        public string DataType { get; set; } = "";

        public VpResponse Successful(string msg, object data = null, string dataType = "")
        {
            this.Success = true;
            this.Message = msg;
            this.Data = data;
            this.DataType = dataType;
            return this;
        }

        public VpResponse Failed(string msg, object data = null, string dataType = "")
        {
            this.Success = false;
            this.Message = msg;
            this.Data = data;
            this.DataType = dataType;
            return this;
        }

        public VpResponse NotFound(string msg)
        {
            this.Success = false;
            this.Message = msg;
            this.Data = VpResponse.NOT_FOUND;
            return this;
        }

        public bool IsNotFound()
        {
            return (this.Success == false) && (this.Data != null) && (this.Data is string) && ((string)this.Data == VpResponse.NOT_FOUND);
        }

        public VpResponse Merge(VpResponse source)
        {
            this.Success = source.Success;
            this.Message = source.Message;
            this.DataType = source.DataType;
            this.Data = source.Data;
            return this;
        }
    }
}
