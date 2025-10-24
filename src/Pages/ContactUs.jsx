import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const ContactUs = () => {
 

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Address",
      details: ["support@skillswap.com"],
      color: "text-blue-600",
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Phone Number",
      details: ["+880 1744546898"],
      color: "text-green-600",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Office Address",
      details: ["Mirpur 10", "Dhaka, Bangladesh"],
      color: "text-red-600",
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Working Hours",
      details: [
        "Mon - Fri: 9:00 AM - 6:00 PM",
        "Sat - Sun: 10:00 AM - 4:00 PM",
      ],
      color: "text-purple-600",
    },
  ];

  return (
    <div className=" bg-gray-50">
      <section className="bg-[#422AD5] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-purple-100">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </section>
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow text-center"
              >
                <div className={`${info.color} mb-4 flex justify-center`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 text-sm mb-1">
                    {detail}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
