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
    }
}
