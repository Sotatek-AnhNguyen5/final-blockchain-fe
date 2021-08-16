import { ethers } from "ethers";
import "./App.css";
import Bep20ABI from "./abis/BEP20.json";
import MasterChef from "./abis/MasterChef.json";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";

const tokenContract = "0xC4929Da14544116d3045740b4115a8edaFff0ddB";
const masterChefAddress = "0xB033a1E87777B2abC9C2dEa12f58E3f29F6Ae714";
const poolId = 1;

function App() {
  const [amount, setAmount] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [index, setIndex] = useState(0);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const bep20Contract = new ethers.Contract(
    tokenContract,
    Bep20ABI.abi,
    signer
  );

  const masterChefContract = new ethers.Contract(
    masterChefAddress,
    MasterChef,
    signer
  );

  const approve = () => {
      bep20Contract
      .approve(
        masterChefAddress,
        new BigNumber(9999999999).times(new BigNumber(10).pow(18)).toFixed()
      )
      .then((e) => {
        console.log(e)
        alert('approve successfully');
      })
      .catch((error) => {
        console.log("error :" + JSON.stringify(error));
      });
  }


  const onDeposit = () => {
    masterChefContract
      .deposit(
        poolId,
        new BigNumber(amount).times(new BigNumber(10).pow(18)).toFixed()
      )
      .then(async (e) => {
        await e.wait(1);
        alert('deposit successfully');
        setIndex(index++)
      })
      .catch((error) => {
        console.log("error :" + JSON.stringify(error));
      });
  };

  const onWithDraw = () => {
    masterChefContract
      .withdraw(
        poolId,
        new BigNumber(amount).times(new BigNumber(10).pow(18)).toFixed()
      )
      .then(async (e) => {
        await e.wait(1);
        alert('withdraw successfully');
        setIndex(index++)
      })
      .catch((error) => {
        console.log("error :" + JSON.stringify(error));
      });
  };

  const harvest = () => {
    masterChefContract
      .harvest(
        poolId,
        amount
      )
      .then(async (e) => {
        await e.wait(1);
        alert('harvest successfully!');
        setIndex(index++)
      })
      .catch((error) => {
        console.log("error :" + JSON.stringify(error));
      });
  }

  const getNFT = () => {
    masterChefContract
      .getSotaNFT(
        poolId,
      )
      .then(async (e) => {
        await e.wait(1);
        alert('get nft successfully');
        setIndex(index++)
      })
      .catch((error) => {
        console.log("error :" + JSON.stringify(error));
      });
  }

  useEffect(async () => {
    const accounts = await signer.getAddress();
    masterChefContract.userInfo(1, accounts).then(e => {
      setUserInfo({...e, index})
    })
  }, [index])

  return (
    <div className="App">
      <input
        name="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="approve-button" onClick={() => approve()}>Approve</button>
      <button className="deposit-button" onClick={() => onDeposit()}>Deposit</button>
      <button className="withdraw-button" onClick={() => onWithDraw()}>Withdraw</button>
      <button className="get NFT" onClick={() => getNFT()}>get NFT</button>
      <button className="harvest" onClick={() => harvest()}>harvest</button>
      <div>Amount : {userInfo.amount ? new BigNumber(userInfo.amount._hex).div(new BigNumber(10).pow(18)).toString() : 0}</div>
      <div>Reward Debt : {userInfo.rewardDebt ? new BigNumber(userInfo.rewardDebt._hex).toString() : 0}</div>
      <div>Last Deposit Time : {userInfo.lastDepositTime ? new BigNumber(userInfo.lastDepositTime._hex).toString() : 0}</div>

    </div>
  );
}

export default App;
