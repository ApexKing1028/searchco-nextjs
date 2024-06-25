"use client";

const ContactPage = () => {
    return (
        <section id="contact" className="overflow-hidden py-6 md:py-10 lg:py-18">
            <div className="container">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <div
                            className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                            data-wow-delay=".15s
              "
                        >
                            <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                                Need Help? Open a Ticket
                            </h2>
                            <p className="mb-12 text-base font-medium text-body-color">
                                Our support team will get back to you ASAP via email.
                            </p>
                            <form>
                                <div className="-mx-4 flex flex-wrap">
                                    <div className="w-full px-4 md:w-1/2">
                                        <div className="mb-8">
                                            <label
                                                htmlFor="from_name"
                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                            >
                                                Your Name
                                            </label>
                                            <input
                                                name="from_name"
                                                type="text"
                                                required
                                                placeholder="Enter your name"
                                                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-[#4A6CF7] dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-[#4A6CF7] dark:focus:shadow-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4 md:w-1/2">
                                        <div className="mb-8">
                                            <label
                                                htmlFor="reply_to"
                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                            >
                                                Your Email
                                            </label>
                                            <input
                                                name="reply_to"
                                                type="email"
                                                required
                                                placeholder="Enter your email"
                                                className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-[#4A6CF7] dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-[#4A6CF7] dark:focus:shadow-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full px-4">
                                        <div className="mb-8">
                                            <label
                                                htmlFor="message"
                                                className="mb-3 block text-sm font-medium text-dark dark:text-white"
                                            >
                                                Your Message
                                            </label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={9}
                                                placeholder="Enter your Message"
                                                className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-[#4A6CF7] dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-[#4A6CF7] dark:focus:shadow-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="w-full px-4">
                                        <button type="submit" className="rounded-sm bg-[#4A6CF7] px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-[#4A6CF7]/90 dark:shadow-submit-dark">
                                            Submit Ticket
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactPage;
