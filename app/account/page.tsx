'use client';

import { ChangePfp } from "./changePfp";
import { ChangeName } from "./changeName";
import { Header } from "./header";

import styles from "../../styles/account/page.module.css";

export default function Account() {
    return (
        <div className={`${styles.body}`}>
            <Header />

            <p>On this page you can edit your account settings</p>

            <br />

            <div className={`${styles.editFields}`}>
                <div className={`${styles.col1} ${styles.row1}`}>
                    <ChangePfp />
                </div>

                <div className={`${styles.col2} ${styles.row1}`}>
                    <ChangeName />
                </div>
            </div>
        </div>
    );
};