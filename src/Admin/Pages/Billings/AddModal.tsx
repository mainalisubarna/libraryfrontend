import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import { useState } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import nepaliDateConverter from "nepali-date-converter";

interface CreateModalProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  data: any;
}
const AddModal = ({ open, onClose, onSubmit, data }: CreateModalProps) => {
  const dateNp = new nepaliDateConverter(new Date()).getDateObject().BS;
  const nepaliDateNow =
    dateNp.year + "-" + (dateNp.month + 1) + "-" + dateNp.date;
  const [date, setDate] = useState<any>(nepaliDateNow);
  const [err, setErr] = useState("");
  const [Transaction, SetTransaction] = useState<any>(null);
  const [inputValue, setInputValue] = useState<any>("");
  const [amount, setAmount] = useState("");
  const handleDate = (date: any) => {
    setDate(date);
  };

  const handleSubmit = () => {
    const values: any = {
      NepaliDate: date,
      TransactionId: Transaction?.id,
      Amount_Recieved: amount,
    };

    if (
      values.TransactionId &&
      values.NepaliDate != "" &&
      values.Amount_Recieved &&
      values.NepaliDate !== null
    ) {
      onSubmit(values);
      setInputValue(null);
      SetTransaction(null);
      setAmount("");
      onClose();
    } else {
      setErr("All field are mandatory to heads up.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <h2 className=" text-2xl font-extrabold leading-none tracking-tight text-gray-900 my-4">
          Create Cash Receipt
        </h2>
        {data && data.length > 0 ? (
          <Autocomplete
            className="w-full py-3"
            value={Transaction}
            onChange={(event, newValue: any) => {
              event;
              SetTransaction(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              event;
              setInputValue(newInputValue);
            }}
            id="manageable-states-demo"
            options={data}
            getOptionLabel={(option) => option.label} // Use 'label' property to display the label
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Choose the Transaction" />
            )}
          />
        ) : (
          <>
            <br />
            <TextField
              value={"No Fine Found to get paid"}
              disabled
              type="text"
              id="outlined-basic"
              label="Choose Transactions"
              variant="standard"
              className="px-3"
            />
            <br />
            <br />
          </>
        )}
        <TextField
          label="Amount Recieved"
          value={amount}
          onChange={(e: any) => setAmount(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="Date">Recieved Date : </label>
        <NepaliDatePicker
          value={date}
          options={{ calenderLocale: "ne", valueLocale: "en" }}
          inputClassName="w-full px-3 my-1 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          onChange={handleDate}
        />
        <p className="text-sm text-red-700">{err ? err : null}</p>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button color="primary" sx={{ mr: 2 }} onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddModal;
