
const toggleNavigation = () => {
    const vertical_navigation = document.getElementsByClassName('vertical-navigation');
    const content = document.getElementsByClassName('content');
    const btn = document.getElementsByClassName('toggle-navigation');
    const p = vertical_navigation[0].getElementsByTagName('p');
    const li = vertical_navigation[0].getElementsByTagName('li');
    const img = vertical_navigation[0].getElementsByTagName('img');
    if (vertical_navigation[0].offsetWidth > 100) {
        vertical_navigation[0].style.width = '86px';
        vertical_navigation[0].classList.remove('col-md-2');
        vertical_navigation[0].classList.add('col-md-1');
        img[0].src = '../public/images/295f1ffb9a134a4d1302.jpg';
        img[0].style.width = '65px';
        img[0].style.marginTop = '5px';
        for (let i = 0; i < li.length; i++) {
            if (p[i]) p[i].style.display = 'none';
            li[i].style.paddingLeft = '0';
            li[i].style.paddingRight = '0';
            li[i].style.justifyContent = 'center';
        }
        content[0].classList.remove('col-md-10');
        content[0].classList.add('col-md-11');
        btn[0].innerHTML = '';
        setTimeout(() => {
            btn[0].innerHTML = '<i class="bi bi-caret-right"></i>';
        }, 300)
    }
    else {
        vertical_navigation[0].style.width = '16.6666666%';
        vertical_navigation[0].classList.remove('col-md-1');
        vertical_navigation[0].classList.add('col-md-2');
        img[0].src = '../public/images/Screenshot 2023-07-10 225924.png';
        img[0].style.width = '90%';
        for (let i = 0; i < li.length; i++) {
            if (p[i]) p[i].style.display = 'block';
            li[i].style.paddingLeft = '40px';
            li[i].style.paddingRight = '20px';
            li[i].style.justifyContent = 'inherit';
        }
        content[0].classList.remove('col-md-11');
        content[0].classList.add('col-md-10');
        btn[0].innerHTML = '';
        setTimeout(() => {
            btn[0].innerHTML = '<i class="bi bi-caret-left"></i>';
        }, 300)
    }
}

function readUrl(input) {
    const display_img = document.getElementsByClassName('display-img')[0];
    let show_image = document.getElementsByClassName('show-image')[0];
    let div = document.getElementsByClassName('box-result')[0];
    let button = document.getElementById('btn-processing');
    button.disabled = false;
    div.innerHTML = '';
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let imgData = e.target.result;
            let imgName = input.files[0].name;
            input.setAttribute("data-title", imgName);
        }
        reader.readAsDataURL(input.files[0]);
        display_img.style.display = 'block';
        display_img.src = URL.createObjectURL(input.files[0]);

    }
    show_image.innerHTML = '';
    show_image.append(display_img);
}

function readUrlSeg(input) {
    const display_img = document.getElementsByClassName('display-img-seg')[0];
    let show_image = document.getElementsByClassName('show-image-seg')[0];
    let div = document.getElementsByClassName('box-result')[0];
    let button = document.getElementById('btn-processing');
    button.disabled = false;
    div.innerHTML = '';
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
            let imgData = e.target.result;
            let imgName = input.files[0].name;
            input.setAttribute("data-title", imgName);
        }
        reader.readAsDataURL(input.files[0]);
        display_img.style.display = 'block';
        display_img.src = URL.createObjectURL(input.files[0]);

    }
    show_image.innerHTML = '';
    show_image.append(display_img);
}

async function classifyImage() {
    let img = document.getElementsByClassName('display-img')[0];
    let div = document.getElementsByClassName('box-result')[0];
    div.innerHTML = '';
    let button = document.getElementById('btn-processing');
    let loading = document.createElement("div");
    loading.innerHTML = `<div class="loader"></div>`
    div.appendChild(loading);
    button.disabled = true;

    const model = await mobilenet.load();

    // Classify the image.
    const predictions = await model.classify(img);
    button.disabled = false;
    div.removeChild(div.firstElementChild);

    for (let i = 0; i < predictions.length; i++) {
        let className = predictions[i].className;
        if (className.lastIndexOf(",") > 0) {
            className = className.slice(className.lastIndexOf(",") + 1)
        }
        let probability = parseFloat(predictions[i].probability).toFixed(2);
        let h3 = document.createElement("h3");
        h3.innerHTML = `<span class="badge badge-dark my-2">${className} | ${probability}</span>`;
        div.appendChild(h3)
    }

}

async function detectionImage() {
    let img = document.getElementsByClassName('display-img')[0];
    let show_image = document.getElementsByClassName('show-image')[0];
    show_image.innerHTML = '';
    show_image.append(img);

    let box_result = document.getElementsByClassName('box-result')[0];
    box_result.innerHTML = '';
    let button = document.getElementById('btn-processing');
    let loading = document.createElement("div");
    loading.innerHTML = `<div class="loader"></div>`
    box_result.appendChild(loading);
    const colors = ['#e34133', '#3473da', '#ffcc00', '#3cc163', '#999fab', '#c65a5a', '#aedbce', '#008037', '#f5ccda', '#0c0c0c'];
    const objects = [];

    button.disabled = true;

    const model = await cocoSsd.load();

    const predictions = await model.detect(img);
    let p_length = predictions.length;
    if (p_length <= 0) {
        let not_obj = document.createElement('p');
        not_obj.classList.add('object_class');
        not_obj.innerHTML = "No objects found";
        box_result.append(not_obj);
        button.disabled = false;
        box_result.removeChild(box_result.firstElementChild);
        return;
    }

    for (let i = 0; i < p_length; i++) {
        var boundingbox = document.createElement('div');
        boundingbox.style.position = 'absolute';
        let x = parseInt(predictions[i].bbox[0]);
        let y = parseInt(predictions[i].bbox[1]);
        let width = parseInt(predictions[i].bbox[2]);
        let height = parseInt(predictions[i].bbox[3]);

        let score = parseFloat(predictions[i].score).toFixed(2);
        var scorebox = document.createElement('p');
        scorebox.style.color = 'white';
        scorebox.style.position = 'absolute';
        scorebox.innerText = score;



        let width_img = img.width;
        let height_img = img.height;

        if (width_img < 500) {
            x += parseInt((500 - width_img) / 2);
        }
        if (height_img < 300) {
            y += parseInt((300 - height_img) / 2);
        }
        boundingbox.style.left = x + 'px';
        scorebox.style.left = x + 'px';
        boundingbox.style.top = y + 'px';
        scorebox.style.top = y + 'px';
        boundingbox.style.width = width + 'px';
        boundingbox.style.height = height + 'px';

        let _class = predictions[i].class;
        boundingbox.classList.add(_class);
        scorebox.classList.add('score_' + _class)
        let id = objects.indexOf(_class);
        if (id >= 0) {
            boundingbox.style.border = 'solid 3px ' + colors[id];
            scorebox.style.backgroundColor = colors[id];
        }
        else {
            let n = objects.length;
            objects.push(_class);
            boundingbox.style.border = 'solid 3px ' + colors[n];
            scorebox.style.backgroundColor = colors[n];
            let switch_btn = document.createElement('div');
            const query = `<div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" onchange="checkedObject(this)" role="switch" id="${_class}" checked/>
            </div>`;
            switch_btn.innerHTML = query;

            let object_class = document.createElement('p');
            let object_color = document.createElement('i');
            let c_obj = document.createElement('div');
            c_obj.classList.add('c_obj');
            object_class.classList.add('object_class');
            object_color.classList.add('object_color');
            object_color.style.backgroundColor = colors[n];
            object_class.innerHTML = _class;
            c_obj.append(switch_btn);
            c_obj.append(object_color);
            c_obj.append(object_class);
            box_result.append(c_obj);
        }



        show_image.append(boundingbox);
        show_image.append(scorebox);
    }
    button.disabled = false;
    box_result.removeChild(box_result.firstElementChild);

}

function checkedObject(input) {
    const _class = input.id;
    const boundingbox = document.getElementsByClassName(_class);
    const score = document.getElementsByClassName('score_' + _class);
    let n = boundingbox.length;
    if (input.checked == true) {
        for (let i = 0; i < n; i++) {
            boundingbox[i].style.display = 'block';
            score[i].style.display = 'block';
        }
    }
    else {
        for (let i = 0; i < n; i++) {
            boundingbox[i].style.display = 'none';
            score[i].style.display = 'none';
        }
    }
}

function segmentationImage() {
    let img = document.getElementsByClassName('display-img-seg')[0];
    let show_image = document.getElementsByClassName('show-image-seg')[0];
    show_image.innerHTML = '';
    show_image.append(img);

    let box_result = document.getElementsByClassName('box-result')[0];
    box_result.innerHTML = '';
    let button = document.getElementById('btn-processing');
    let loading = document.createElement("div");
    loading.innerHTML = `<div class="loader"></div>`
    box_result.appendChild(loading);

    const objects = [];

    button.disabled = true;

    const loadModel = async () => {
        const modelName = 'pascal';
        const quantizationBytes = 2;
        return await deeplab.load({ base: modelName, quantizationBytes });
    };

    loadModel()
        .then((model) => model.segment(img))
        .then(
            (output) => {
                console.log(output)
                const canvas = document.createElement('canvas');
                var ctx = canvas.getContext("2d");
                canvas.width = output.width;
                canvas.height = output.height;
                const content = new Uint8Array(output.segmentationMap.length);
                content.set(output.segmentationMap)
                var imageData = ctx.createImageData(output.width, output.height);

                imageData.data.set(content);
                ctx.putImageData(imageData, 0, 0);

                const div_result = document.createElement('div');
                div_result.classList.add('blop');

                div_result.classList.add('div_result_img');
                const div_contain_label = document.createElement('div');
                const legend = output.legend;
                for (const [key, value] of Object.entries(legend)) {
                    var p = document.createElement('p');
                    p.classList.add('label-seg');
                    p.innerHTML = key;
                    p.style.backgroundColor = 'rgb(' + value[0] + ',' + value[1] + ',' + value[2] + ')';
                    div_contain_label.append(p)
                }
                div_result.append(canvas);
                div_result.append(div_contain_label);

                box_result.append(div_result);
            }
        );

    button.disabled = false;
    box_result.removeChild(box_result.firstElementChild);

}

const stopWebCam = function () {
    const divbb = document.getElementsByClassName("div-bb")[0];

    if (divbb) {
        divbb.parentNode.removeChild(divbb);
    }
    const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    const video = document.getElementById('detection-video');

    let btn_start = document.getElementsByClassName('btn-start')[0];
    btn_start.style.backgroundColor = '#e4e6ea';
    btn_start.style.color = 'black';
    var stream = video.srcObject;
    console.log(stream)
    stream.getTracks().forEach(function (track) {
        track.stop();
    });
    video.srcObject = null;
}

const startWebCam = function () {
    let btn_start = document.getElementsByClassName('btn-start')[0];
    btn_start.style.backgroundColor = '#3b71ca';
    btn_start.style.color = 'white';
    var video = document.getElementById("detection-video"),
        vendorURL = window.URL || window.webkitURL;

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            }).catch(function (error) {
                console.log("Something went wrong");
            });
    }
}

const faceDetection = async function () {
    const video_detect = document.getElementById('detection-video');
    const div_video = document.getElementsByClassName('div-video')[0];
    console.log(video_detect);
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: 'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',

    };
    const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
    const estimationConfig = { flipHorizontal: false };
    setInterval(async () => {
        const divbb = document.getElementsByClassName("div-bb");

        if (divbb) {
            let k = divbb.length
            for(let i = 0; i < k; i++) {
                divbb[i].parentNode.removeChild(divbb[i]);
            }
            
        }

        const faces = await detector.estimateFaces(video_detect, estimationConfig);
        let n = faces.length
        for (let i = 0; i < n; i++) {
            const div_bb = document.createElement('div');
            div_bb.style.position = 'absolute';
            let width = parseInt(faces[i].box.width);
            let height = parseInt(faces[i].box.height);
            let xMin = parseInt(faces[i].box.xMin);
            let yMin = parseInt(faces[i].box.yMin);
            let left = parseInt((925 - 650) / 2 + xMin);
            div_bb.style.width = width + 'px';
            div_bb.style.height = height + 'px';
            div_bb.style.left = left + 'px';
            div_bb.style.top = yMin + 'px';
            div_bb.classList.add('div-bb');
            div_bb.style.border = '3px solid blue';
            div_video.append(div_bb)
        }

    }, 100)

}