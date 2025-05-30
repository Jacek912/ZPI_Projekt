namespace wms_api.Model
{
    using System.ComponentModel.DataAnnotations;
    public class Product
    {
        [Key] 
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? Amount { get; set; }
        public int? Category { get; set; }
        public int? BarCode { get; set; }
        public int? MinAmount { get; set; }
        public int? MaxAmount { get; set; }

        public string GetPack()
        {
            return "Id: " + Id + ", " +
                    "Name: " + Name + ", " +
                    "Desc: " + Description + ", " +
                    "Amount: " + Amount + ", " +
                    "Category: " + Category + ", " +
                    "BarCode: " + BarCode + ", " +
                    "MinAmount: " + MinAmount + ", " +
                    "MaxAmount: " + MaxAmount;
        }
    }
}
