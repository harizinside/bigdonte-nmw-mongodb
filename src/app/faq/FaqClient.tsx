"use client"; // Agar bisa menggunakan useState

import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import styles from "@/css/Faq.module.css";

interface Faq {
  _id: string;
  question: string;
  answer: string;
}

interface FaqListProps {
  faqs: Faq[];
}

export default function FaqClient({ faqs }: FaqListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqList}>
      {faqs.map((faq, index) => (
        <div
          key={faq._id}
          className={`${styles.faqItem} ${
            activeIndex === index ? styles.active : ""
          }`}
        >
          <button className={styles.question} onClick={() => toggleFAQ(index)}>
            {faq.question}
            <IoChevronDown />
          </button>
          <div
            className={`${styles.answer} ${
              activeIndex === index ? styles.show : ""
            }`}
          >
            <p>{faq.answer.replace(/<p[^>]*>/g, "").replace(/<\/p>/g, "")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
