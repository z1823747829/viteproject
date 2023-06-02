const user = {
    id: 0,
    nickname: '',
    uname: '',
    gender: 0,
    head: '',
    birthday: "2000-01-01",
    email: '',
    phone: '',
}
const academy = {
    id: 0,
    academy: '',
    code: '',
    img: '',
    profile: '',
}
const keyword = {
    id: 0,
    keyword: '',
    clicks: 0,
}
const course = {
    id: 0,
    course: '',
    img: '',
    profile: '',
    teacher: '',
    keyword: [keyword],
    clicks: 0,
}
const course_resource = {
    id: 0,
    resource: '',
    resource_file: '',
    course: 0,
    order: 0,
}
const forum = {
    id: 0,
    user: user,
    title: '',
    profile: '',
    md_content: '',
    rtf_content: '',
    content_type: 1,
    annex: "",
    keyword: [],
    time: "",
    status: 0,
    clicks: 0,
}
const comment = {
    id: 0,
    user: user,
    course: 0,
    forum: '',
    content: '',
    time: '',
}

export {
    user, academy, course, course_resource, forum, comment, keyword,
}