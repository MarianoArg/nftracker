import FormatCurrency from "~/components/FormatCurrency";
import type { FC, ComponentProps } from "react";

type FormatCryptoProps = {
  address?: string;
  logoWidth?: number;
};

type Props = ComponentProps<typeof FormatCurrency> & FormatCryptoProps;

const FormatCrypto: FC<Props> = ({
  amount,
  maximumFractionDigits,
  address,
  logoWidth = 16,
}) => {
  const logoUrl = `https://api.reservoir.tools/redirect/currency/${address}/icon/v1`;

  return (
    <FormatCurrency
      amount={amount}
      maximumFractionDigits={maximumFractionDigits}
    >
      {address && (
        <img
          src={logoUrl}
          alt="Crypto currency Logo"
          style={{ width: `${logoWidth}px` }}
        />
      )}
    </FormatCurrency>
  );
};

export default FormatCrypto;
