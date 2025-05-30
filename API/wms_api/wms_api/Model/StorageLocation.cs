namespace wms_api.Model
{
    using System.ComponentModel.DataAnnotations;
    public class StorageLocation
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }

        public string GetPack()
        {
            return "Id: " + Id + ", Name: " + Name + ", Desc: " + Description;
        }
    }
}
