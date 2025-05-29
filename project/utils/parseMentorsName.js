const parseMentorsName = (mentorField) => {
    const mentorId = mentorField?.value?.[0];
    const mentorOption = mentorField?.options?.find(
        (opt) => opt.id === mentorId
    );
    const mentorName = mentorOption?.text || "ناشناخته";

    return mentorName;
};

module.exports = parseMentorsName;
