using Microsoft.AspNetCore.Identity;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using wms_api.Model;

namespace wms_api.Database
{
    public class ContextCreator
    {
        public static AppDbContext? dbContext;

        public static void InitContext()
        {
            dbContext = new AppDbContext();
            dbContext.Database.EnsureCreated();
            AddDefaultUser();
        }

        private static void AddDefaultUser()
        {
            if (dbContext == null)
            {
                return;
            }
            var login = "admin";
            var password = "admin";
            var defaultUser = dbContext.Users.FirstOrDefault(user => user.Login == login);

            if (defaultUser != null)
            {
                return;
            }

            UTF8Encoding utf8Encoding = new UTF8Encoding();
            SHA256 sha256 = SHA256.Create();
            var passToSave = Convert.ToBase64String(sha256.ComputeHash(utf8Encoding.GetBytes(password)));
            var user = new User() { Login = login, Password = passToSave };
            dbContext.Users.Add(user);
            dbContext.SaveChanges();
        }
    }
}
