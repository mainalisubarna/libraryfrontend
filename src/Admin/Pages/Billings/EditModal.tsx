import { Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { POST_API_JWT } from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";

const EditModal = ({
  rows,
  handleCloseEditModal,
  fetchData,
  openEditModal,
}: any) => {
  const [amount, setAmount] = useState<any>();
  const [err, setErr] = useState("");
  const jwt = GET_JWT_TOKEN();
  const handleSaveEditModal = async () => {
    const id = rows?.original.Id;
    const values: any = {
      Amount_Recieved: Number(amount) + Number(rows?.original.Amount_Recieved),
    };
    const balance =
      Number(rows?.original.BookTransaction.Fine_Amt) -
      Number(rows?.original.Amount_Recieved);
    if (values?.Amount_Recieved > 0 && amount <= balance) {
      const response = await POST_API_JWT(
        `/billings/fine/edit/${id}`,
        values,
        jwt
      );
      if (response.status) {
        toast.success(response.message);
        setAmount("");
        setErr("");
        handleCloseEditModal();
        fetchData();
      } else {
        toast.error(response.message);
        handleCloseEditModal();
      }
    } else {
      setErr("Please Make a valid input");
    }
  };

  return (
    <Modal open={openEditModal} onClose={handleCloseEditModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 className=" text-2xl font-extrabold leading-none tracking-tight text-gray-900  my-2">
          Add the Amount Recieved Now
        </h2>
        <p className="my-2">
          Remaining Fine Amount to recieve : Rs{" "}
          {rows?.original.BookTransaction.Fine_Amt -
            rows?.original.Amount_Recieved}
        </p>
        <TextField
          inputMode="numeric"
          label="Amount Recieved"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <p className="text-xs mt-2">
          Click save only after collecting the fine amount as mentioned above
        </p>
        <p className="my-2 text-red-700"> {err ? err : null}</p>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button color="primary" sx={{ mr: 2 }} onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSaveEditModal}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
