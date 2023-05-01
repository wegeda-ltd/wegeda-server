import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';

import {
    addToFavoriteRouter,
    getRoomFavoritesRouter,
    getAllFavoritesRouter,
    getRoommateFavoritesRouter,
    removeFromFavoriteRouter
} from './routes/favorites';

import {
    createListingRouter,
    getAllAgentListingRouter,
    getAllListingsRouter,
    getAllNonAgentListingRouter,
    getListingByIdRouter,
    getUserListingRouter,
    standbyOnListingRouter,
    updateListingRouter
} from './routes/listing';

import {
    clearAllNotificationsRouter,
    createNotificationRouter,
    deleteNotificationRouter,
    getAllNotificationRouter,
    getNotificationRouter,
    markNotificationAsReadRouter
} from './routes/notification';

import {
    createChatSubscriptionRouter,
    createListingSubscriptionRouter,
    getAllChatSubscriptionRouter,
    getAllListingSubscriptionRouter,
    getuserSubscriptionRouter,
    initializePaymentRouter,
    subscribeToChatRouter,
    subscribeToListRouter,
} from './routes/subscription';

import {
    currentUserRouter,
    getAllUsersRouter,
    getUserByIdRouter,
    onboardingAgentRouter,
    onboardingHouseSeekerRouter,
    resendOtpRouter,
    sendOtpRouter,
    updateUserRouter,
    verifyOtpRouter
} from './routes/user';

import {
    getAddressHistoryRouter,
    getAllAddressRouter,
    getAllFinancialStatementRouter,
    getAllNinRouter,
    getAllOccupationParticularRouter,
    getAllSocialMediaRouter,
    getFinancialStatementRouter,
    getNinRouter,
    getOccupationParticularRouter,
    getSocialMediaRouter,
    uploadAddressHistoryRouter,
    uploadFinancialStatementRouter,
    uploadNinRouter,
    uploadOccupationParticularRouter,
    uploadSocialsRouter,
    verifyAddressHistoryRouter,
    verifyIncomeRouter,
    verifyNinRouter,
    verifyOccupationRouter,
    verifySocialsRouter
} from './routes/verification';


const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,

}));

app.use([
    // favorites
    addToFavoriteRouter,
    getRoomFavoritesRouter,
    getAllFavoritesRouter,
    getRoommateFavoritesRouter,
    removeFromFavoriteRouter,

    // Listing
    createListingRouter,
    getAllAgentListingRouter,
    getAllListingsRouter,
    getAllNonAgentListingRouter,
    getListingByIdRouter,
    getUserListingRouter,
    standbyOnListingRouter,
    updateListingRouter,

    // Notification
    clearAllNotificationsRouter,
    createNotificationRouter,
    deleteNotificationRouter,
    getAllNotificationRouter,
    getNotificationRouter,
    markNotificationAsReadRouter,

    // Subscription
    createChatSubscriptionRouter,
    createListingSubscriptionRouter,
    getAllChatSubscriptionRouter,
    getAllListingSubscriptionRouter,
    getuserSubscriptionRouter,
    initializePaymentRouter,
    subscribeToChatRouter,
    subscribeToListRouter,

    // User
    currentUserRouter,
    getUserByIdRouter,
    getAllUsersRouter,
    onboardingAgentRouter,
    onboardingHouseSeekerRouter,
    resendOtpRouter,
    sendOtpRouter,
    updateUserRouter,
    verifyOtpRouter,

    // Verification
    getAddressHistoryRouter,
    getAllAddressRouter,
    getAllFinancialStatementRouter,
    getAllNinRouter,
    getAllOccupationParticularRouter,
    getAllSocialMediaRouter,
    getFinancialStatementRouter,
    getNinRouter,
    getOccupationParticularRouter,
    getSocialMediaRouter,
    uploadAddressHistoryRouter,
    uploadFinancialStatementRouter,
    uploadNinRouter,
    uploadOccupationParticularRouter,
    uploadSocialsRouter,
    verifyAddressHistoryRouter,
    verifyIncomeRouter,
    verifyNinRouter,
    verifyOccupationRouter,
    verifySocialsRouter
])
app.get("/", (req, res) => {

    res.send({ message: "I am working fine!" })
})
app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }
