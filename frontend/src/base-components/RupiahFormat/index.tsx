interface RupiahFormatProps {
  amount: string | number;
}

function RupiahFormat({ amount }: RupiahFormatProps) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // You can adjust this value based on your preference
  }).format(Number(amount));

  return <span>{formattedAmount}</span>;
}

export default RupiahFormat;
