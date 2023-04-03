import {useEffect, useState} from "react";
import {getKnowledgeCoinBalanceInRange} from "../../web3/src/entrypoints/account/coin";
import {Semester} from "../../pages/semester";
import CoinDisplay from "./CoinDisplay";

export default function Student({selectedSemester, getSemesterById, web3, userAddress}: { selectedSemester: string, getSemesterById: (id: string) => Semester | undefined, web3: any, userAddress: string }) {
    const [coins, setCoins] = useState<number>(0);

    const getMissingCoins = () => {
        const semester = getSemesterById(selectedSemester);

        if (selectedSemester === "") return 0;
        if (semester === undefined) return 0;

        return semester.minKnowledgeCoinAmount - coins;
    }

    useEffect(() => {
        console.log("Student useEffect");

        const semester = getSemesterById(selectedSemester);

        if (semester && web3.utils.isAddress(userAddress)) {
            getKnowledgeCoinBalanceInRange(web3, userAddress, semester.startBlock, semester.endBlock).then((result) => {
                setCoins(result);
            }).catch((e) => {
                alert("Error while checking coin balance: " + e.message);
            });
        }
    }, [web3, userAddress, selectedSemester]);

    return (
       <CoinDisplay minKnowledgeCoinAmount={getSemesterById(selectedSemester)?.minKnowledgeCoinAmount} coins={coins} missingCoins={getMissingCoins()}/>
    )
}
