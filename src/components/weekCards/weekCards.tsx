// WeekCards.tsx

import React from 'react';
import styles from './WeekCards.module.css';

const WeekCards: React.FC = () => {
    return (
        <div className={styles.weekCards}>
                <div className={styles.column}></div>
                <div className={styles.column}></div>
                <div className={styles.column}></div>
        </div>
    );
};

export default WeekCards;
