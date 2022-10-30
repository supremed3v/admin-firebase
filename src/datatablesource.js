export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "address",
    headerName: "Address",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

export const productColumn = [
  { field: "id", headerName: "ID", width: 200 },
  {
    field: "product",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            style={{ objectFit: "contain" }}
            src={params.row.images[0]}
            alt="avatar"
          />
          {params.row.title}
        </div>
      );
    },
  },
  {
    field: "stock",
    headerName: "Stock",
    width: 50,
  },

  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
  {
    field: "Description",
    headerName: "Description",
    width: 230,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.description}`}>
          {params.row.description}
        </div>
      );
    },
  },
];
