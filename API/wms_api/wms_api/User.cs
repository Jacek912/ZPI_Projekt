namespace wms_api
{
    using System.ComponentModel.DataAnnotations;
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }
    }
}
