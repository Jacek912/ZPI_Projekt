namespace wms_api.Model
{
    using System.ComponentModel.DataAnnotations;
    public class ProductCategory
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public double? Weight { get; set; }
        public double? MaxSize { get; set; }

        public string GetPack()
        {
            return "Id: " + Id + ", " +
                   "Name: " + Name + ", " +
                   "Desc: " + Description + ", " +
                   "MinPrice: " + MinPrice + ", " +
                   "MaxPrice: " + MaxPrice + ", " +
                   "Weight: " + Weight + ", " +
                   "MaxSize: " + MaxSize;
        }

    }
}
