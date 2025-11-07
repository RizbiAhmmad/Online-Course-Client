import React from 'react';
import Banner from './Banner';
import CourseCard from './CourseCard';
import Reviews from './Reviews';
import StatsSection from './StatsSection';
import Footer from '@/Shared/Footer';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <CourseCard></CourseCard>
            <Reviews></Reviews>
            <StatsSection></StatsSection>
            <Footer></Footer>
        </div>
    );
};

export default Home;