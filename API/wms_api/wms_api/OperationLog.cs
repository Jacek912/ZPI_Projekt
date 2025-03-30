namespace wms_api
{
    public class OperationLog
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int ProductId { get; set; }
        public string OperationCategory { get; set; }
        public int Amount { get; set; }

    }
}
