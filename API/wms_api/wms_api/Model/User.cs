namespace wms_api.Model
{
    using System.ComponentModel.DataAnnotations;
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string? Login { get; set; }
        public string? Password { get; set; }

        public string GetPack()
        {
            return "Id: " + Id + "Login: " + Login;
        }
    }
}
