namespace wms_api
{
    using System.ComponentModel.DataAnnotations;
    public class OperationLog
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? ProductId { get; set; }
        public string? OperationCategory { get; set; }
        public int? Amount { get; set; }

    }
}
