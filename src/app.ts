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
    getListingStandbyRouter,
    getSimilarListingsRouter,
    getUserListingRouter,
    getUserStandbyRouter,
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
    getUserSubscriptionRouter,
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
import {
    createNewGroupRouter,
    getChatUsersRouter,
    getGroupRouter,
    getMessageDetailsRouter,
    getMessagesRouter,
    sendMessageRouter,
    editMessageRouter,
    deleteMessageRouter
} from './routes/messaging';
import { checkinRouter, checkoutRouter, downloadPDFRouter, downloadRoommateAgreementRouter, getRoommatesRouter, uploadRoommateAgreementRouter } from './routes/checkin';


const app = express();
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,

}));



app.use([
    // Checkin
    checkinRouter,
    checkoutRouter,
    downloadRoommateAgreementRouter,
    downloadPDFRouter,
    getRoommatesRouter,
    uploadRoommateAgreementRouter,

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
    getUserStandbyRouter,
    getListingByIdRouter,
    getListingStandbyRouter,
    getSimilarListingsRouter,
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
    getUserSubscriptionRouter,
    getAllChatSubscriptionRouter,
    getAllListingSubscriptionRouter,
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
    verifySocialsRouter,


    // MESSAGING
    sendMessageRouter,
    deleteMessageRouter,
    editMessageRouter,
    getGroupRouter,
    getChatUsersRouter,
    getMessagesRouter,
    getMessageDetailsRouter,
    createNewGroupRouter
])
app.get("/", (req, res) => {

    res.send({ message: "I am working fine!" })
})
app.all('*', () => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app }
