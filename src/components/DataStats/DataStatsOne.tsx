'use client'

import React from "react";
import { dataStats } from "@/types/dataStats";
import { useState, useEffect } from "react";

const DataStatsOne: React.FC<dataStats> = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [branchCount, setBranchCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [catalogCount, setCatalogCount] = useState(0);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [promoCount, setPromoCount] = useState(0);
  const [loading, setLoading] = useState(false)

  const fetchData = async () => { 
    setLoading(true);
    try {
      // const response = await fetch(`/api/subscribers?page=${currentPage}`);
      const response = await fetch(`/api/articles?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseBranches = await fetch(`/api/branches?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseDoctors = await fetch(`/api/doctors?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseServices = await fetch(`/api/services?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseCatalogs = await fetch(`/api/catalogs?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseSubscribers = await fetch(`/api/subscribers?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responseAchievements = await fetch(`/api/achievements?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      const responsePromos = await fetch(`/api/promos?page=all`,  {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); 
      const resultBranches = await responseBranches.json(); 
      const resultDoctors = await responseDoctors.json(); 
      const resultServices = await responseServices.json(); 
      const resultCatalogs = await responseCatalogs.json(); 
      const resultSubscribers = await responseSubscribers.json(); 
      const resultAchievements = await responseAchievements.json(); 
      const resultPromos = await responsePromos.json(); 
      
      setArticleCount(result.totalArticles);
      setBranchCount(resultBranches.totalBranches);
      setDoctorCount(resultDoctors.totalDoctors);
      setServiceCount(resultServices.totalServices);
      setCatalogCount(resultCatalogs.totalCatalogs);
      setSubscriberCount(resultSubscribers.totalSubscribers);
      setAchievementCount(resultAchievements.totalAchievements);
      setPromoCount(resultPromos.totalPromos);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataStatsList = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
          <path fill="#fff" fillRule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9v-5a3 3 0 0 1 3-3h5V5a3 3 0 0 0-3-3zm12.293 19.121a3 3 0 0 1-1.293.762V17a1 1 0 0 1 1-1h4.883a3 3 0 0 1-.762 1.293zM7 6a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" clipRule="evenodd"/>
        </svg>
      ),
      color: "#3FD97F",
      title: "Total Articles",
      value: loading ? "Loading..." : `${articleCount} Articles`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
          <path fill="#fff" fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5zM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75M6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75M6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5zM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75M10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75M10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5zm6-5.25v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75zM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75z" clipRule="evenodd"/>
        </svg>
      ),
      color: "#FF9C55",
      title: "Total Branches",
      value:  loading ? "Loading..." : `${branchCount} Branches`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26"><path fill="#fff" d="M13 0c-2.1 0-3.357.32-4.156.719c-.4.2-.684.41-.875.625a2 2 0 0 0-.313.531a1 1 0 0 0-.062.25l-.532 6.844c-.007.042.007.11 0 .156L7 9.813A1 1 0 0 0 7 10c0 3.3 2.7 6 6 6s6-2.7 6-6v-.187l-.594-7.688a1 1 0 0 0-.062-.25s-.121-.316-.313-.531c-.191-.216-.475-.426-.875-.625C16.357.319 15.1 0 13 0m0 16c-6.6 0-12 3.106-12 5.906V26h24v-4.094c0-2.66-4.882-5.59-11.031-5.875A14 14 0 0 0 13 16m0-14c1.9 0 2.849.3 3.25.5c.134.067.15.093.188.125l.406 5.125C15.924 7.806 14.67 8 13 8s-2.923-.194-3.844-.25l.406-5.125c.037-.032.054-.058.188-.125c.401-.2 1.35-.5 3.25-.5m-.813 1v1.188H11v1.625h1.188V7h1.624V5.812H15V4.188h-1.188V3zM10 18.25L12.563 24H3v-2.094c0-.745 2.55-2.927 7-3.656m6 0c4.45.73 7 2.911 7 3.656V24h-9.563z"/></svg>
      ),
      color: "#8155FF",
      title: "Total Doctors",
      value: loading ? "Loading..." : `${doctorCount} Doctors`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="#fff" d="M10 3L8 5v2H5C3.85 7 3.12 8 3 9L2 19c-.12 1 .54 2 2 2h16c1.46 0 2.12-1 2-2L21 9c-.12-1-.94-2-2-2h-3V5l-2-2zm0 2h4v2h-4zm1 5h2v3h3v2h-3v3h-2v-3H8v-2h3z"/></svg>
      ),
      color: "#18BFFF",
      title: "Total Services",
      value: loading ? "Loading..." : `${serviceCount} Services`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="#fff" d="M3 21V5.8L5.3 3h13.4L21 5.8V21zM5.4 6h13.2l-.85-1H6.25zM8 16l4-2l4 2V8H8z"/></svg>
      ),
      color: "#5B913B",
      title: "Total Catalog",
      value: loading ? "Loading..." : `${catalogCount} Catalog`,
    },
    {
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="9.75106"
            cy="6.49984"
            rx="4.33333"
            ry="4.33333"
            fill="white"
          />
          <ellipse
            cx="9.75106"
            cy="18.4178"
            rx="7.58333"
            ry="4.33333"
            fill="white"
          />
          <path
            d="M22.7496 18.4173C22.7496 20.2123 20.5445 21.6673 17.8521 21.6673C18.6453 20.8003 19.1907 19.712 19.1907 18.4189C19.1907 17.1242 18.644 16.0349 17.8493 15.1674C20.5417 15.1674 22.7496 16.6224 22.7496 18.4173Z"
            fill="white"
          />
          <path
            d="M19.4996 6.50098C19.4996 8.2959 18.0446 9.75098 16.2496 9.75098C15.8582 9.75098 15.483 9.68179 15.1355 9.55498C15.648 8.65355 15.9407 7.61084 15.9407 6.49977C15.9407 5.38952 15.6484 4.34753 15.1366 3.44656C15.4838 3.32001 15.8587 3.25098 16.2496 3.25098C18.0446 3.25098 19.4996 4.70605 19.4996 6.50098Z"
            fill="white"
          />
        </svg>
      ),
      color: "#8E1616",
      title: "Total Subscribers",
      value: loading ? "Loading..." : `${subscriberCount} Subscribers`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="#fff" d="M18 2c-.9 0-2 1-2 2H8c0-1-1.1-2-2-2H2v9c0 1 1 2 2 2h2.2c.4 2 1.7 3.7 4.8 4v2.08C8 19.54 8 22 8 22h8s0-2.46-3-2.92V17c3.1-.3 4.4-2 4.8-4H20c1 0 2-1 2-2V2zM6 11H4V4h2zm14 0h-2V4h2z"/></svg>
      ),
      color: "#F1C376",
      title: "Total Achievement",
      value: loading ? "Loading..." : `${achievementCount} Achievement`,
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path fill="#fff" d="M17 3.34A10 10 0 1 1 2 12l.005-.324A10 10 0 0 1 17 3.34M14.5 13a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m1.207-4.707a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414M9.5 8a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"/></svg>
      ),
      color: "#42032C",
      title: "Total Promo",
      value: loading ? "Loading..." : `${promoCount} Promo`,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div
            key={index}
            className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
          >
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {item.value}
                </h4>
                <span className="text-body-sm font-medium">{item.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStatsOne;
