namespace wms_api.Model
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class StorageLocationProduct
    {
        [Key, Column(Order = 0)]
        public int StorageLocationId { get; set; }
        [Key, Column(Order = 1)]
        public int ProductId { get; set; }
    }
}
