namespace wms_api.Database
{
    public class ContextCreator
    {
        public static AppDbContext? dbContext;

        public static void InitContext()
        {
            dbContext = new AppDbContext();
            dbContext.Database.EnsureCreated();
        }
    }
}
