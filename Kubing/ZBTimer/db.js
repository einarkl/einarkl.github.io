const dbName = "zb_timer";
const storeName = "sessions";
const version = 1;
const readwrite = "readwrite";
const readonly = "readonly";

let db = null;

function openDB(func, arg1 = false, arg2 = false, arg3 = false) {
    const request = indexedDB.open(dbName);
    
    request.onupgradeneeded = e => {
        db = e.target.result;

        const store1 = db.createObjectStore("sessions");
        const store2 = db.createObjectStore("solutions");
        store2.createIndex("totalTimeIDX", "totalTime", {unique: false});
        store2.createIndex("ao3IDX", "ao3", {unique: false});
        store2.createIndex("ao5IDX", "ao5", {unique: false});
        store2.createIndex("ao12IDX", "ao12", {unique: false});
        store2.createIndex("ao25IDX", "ao25", {unique: false});
        store2.createIndex("ao50IDX", "ao50", {unique: false});
        store2.createIndex("ao100IDX", "ao100", {unique: false});
        store2.createIndex("ao200IDX", "ao200", {unique: false});
        store2.createIndex("ao500IDX", "ao500", {unique: false});
        store2.createIndex("ao1000IDX", "ao1000", {unique: false});
        store2.createIndex("ao2000IDX", "ao2000", {unique: false});
        store2.createIndex("ao5000IDX", "ao5000", {unique: false});
        store2.createIndex("ao10000IDX", "ao10000", {unique: false});

        localStorage.removeItem("zb_timer_settings");
    }
    
    request.onsuccess = e => {
        db = e.target.result;
        if (func) {
            if (arg3) {
                func(arg1,arg2,arg3);
            }
            else if (arg2) {
                func(arg1,arg2);
            }
            else if (arg1) {
                func(arg1);
            }
            else {
                func();
            }
        }
    }
    
    request.onerror = e => {
        console.log(e);
    }
}

function refreshDatabase() {
    const request = indexedDB.deleteDatabase("myDatabase");

    request.onerror = function(event) {
        console.log("Error deleting database.");
    };

    request.onsuccess = function(event) {
        console.log("Database deleted successfully.");
        openDB();
    };
}

function editDB(key, val, dontGetAll = false) {
    const tx = db.transaction(storeName, readwrite);
    const store = tx.objectStore(storeName);
    store.put(val, key);
    
    if (!dontGetAll) {
        getAllFromDB();
    }
}

function addToDB(key, val, dontGetAll = false) {
    const tx = db.transaction(storeName, readwrite);
    const store = tx.objectStore(storeName);
    store.add(val, key);
    
    if (!dontGetAll) {
        getAllFromDB();
    }
}

function addSolutionsToDB(val, ind) {
    if (ind === 0) {
        removeAllFromDB("solutions");
    }
    else {
        for (let i = ind; i < solutionsUnsorted.length; i++) {
            removeFromDB(i, "solutions");
        }
    }
    const tx = db.transaction("solutions", readwrite);
    const store = tx.objectStore("solutions");
    
    for (let i = ind; i < val.length; i++) {
        let s = val[i];
        store.add({
            time: s.time,
            penalty: s.penalty,
            scramble: s.scramble,
            comment: s.comment,
            date: s.date,
            totalTime: s.time + (s.penalty === -1 ? Infinity : s.penalty),
            index: s.index,
            caseID: s.caseID,
            ao3: s.ao3,
            ao5: s.ao5,
            ao12: s.ao12,
            ao25: s.ao25,
            ao50: s.ao50,
            ao100: s.ao100,
            ao200: s.ao200,
            ao500: s.ao500,
            ao1000: s.ao1000,
            ao2000: s.ao2000,
            ao5000: s.ao5000,
            ao10000: s.ao10000
        }, i);
    }
    
    if (calcStats) {
        calcStats = false;
        getCurStats(ind);
    }
    else {
        const tx = db.transaction("solutions", readwrite);
        const store = tx.objectStore("solutions");
        const request = store.getAll();
        let data;
        
        request.onsuccess = e => {
            data = e.target.result;
            solutionsUnsorted = data;

            const tx2 = db.transaction("solutions", readwrite);
            const store2 = tx.objectStore("solutions");
            const idx = store.index("totalTimeIDX");
            const request2 = idx.getAll();
            let data2;
            
            request2.onsuccess = e => {
                data2 = e.target.result;
                solutionsSorted = data2;
                
                for (let n of avgList) {
                    averages["cur"][n] = solutionsUnsorted.length > 0 ? solutionsUnsorted[solutionsUnsorted.length - 1]["ao" + n] : Infinity;
                }

                for (let n of avgList) {
                    getBestAvgFromDB(n, n === avgList[avgList.length - 1]);
                }

                updateStats();
            }
        }
    }
}

function getFromDB(key) {
    var tx = db.transaction(storeName);
    var store = tx.objectStore(storeName);
    var request = store.get(key);
    
    request.onsuccess = e => {
        if (request.result) {
            return request.result;
        }
        else {
            console.log(e);
        }
    };
    
    request.onerror = e => {
       console.log(e);
    };
}

function getAllFromDB(exporting = false) {
    const tx = db.transaction(storeName, readonly);
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    let data;
    
    request.onsuccess = e => {
        data = e.target.result;
        // List opp data
        if (exporting) {
            getExportData(data);
        }
        else {
            getData(data);
        }
    }

    request.onerror = e => {
        console.log(e);
    }
}

function getAllSolutionsFromDB(exporting = false) {
    const tx = db.transaction("solutions", readonly);
    const store = tx.objectStore("solutions");
    const request = store.getAll();
    let data;
    
    request.onsuccess = e => {
        data = e.target.result;
        // List opp data
        if (exporting) {
            getExportData(data);
        }
        else {
            getData(data);
        }
    }

    request.onerror = e => {
        console.log(e);
    }
}

function removeFromDB(key, st = "storeName") {
    const request = db.transaction(st, readwrite)
    .objectStore(st)
    .delete(key);
    
    request.onsuccess = e => {
       
    };
    
    request.onerror = e => {
        console.log(e);
    };
}

function removeAllFromDB(s = storeName) {
    doNotCreateNew = true;
    const request = db.transaction(s, readwrite)
    .objectStore(s)
    .clear();
    
    request.onsuccess = e => {
        
    };
    
    request.onerror = e => {
        console.log(e);
    };
}

function getCurStats(ind) {
    const tx = db.transaction("solutions", readwrite);
    const store = tx.objectStore("solutions");
    const request = store.getAll();
    let data;
    
    request.onsuccess = e => {
        data = e.target.result;
        solutionsUnsorted = data;

        for (let n of avgList) {
            averages["cur"][n] = getAvg(data.map(t => t.totalTime).slice(data.length-parseInt(n)), parseInt(n));
        }

        if (solutionsUnsorted.length !== 0) {
            let t = solutionsUnsorted[ind];
            let sol = {
                time: t.time,
                penalty: t.penalty,
                scramble: t.scramble,
                comment: t.comment,
                date: t.date,
                totalTime: t.totalTime,
                index: t.index,
                caseID: t.caseID,
                ao3: averages["cur"][3],
                ao5: averages["cur"][5],
                ao12: averages["cur"][12],
                ao25: averages["cur"][25],
                ao50: averages["cur"][50],
                ao100: averages["cur"][100],
                ao200: averages["cur"][200],
                ao500: averages["cur"][500],
                ao1000: averages["cur"][1000],
                ao2000: averages["cur"][2000],
                ao5000: averages["cur"][5000],
                ao10000: averages["cur"][10000]
            };
            store.put(sol, t.index);

            const tx2 = db.transaction("sessions", readwrite);
            const store2 = tx2.objectStore("sessions");
            sessionList[curSession].solutions[t.index] = sol;
            store2.put(sessionList[curSession], sessionList[curSession].id);
        }

        getBestStats(ind);
    }

    request.onerror = e => {
        console.log(e);
    }
}

function getBestStats(ind) {
    const tx = db.transaction("solutions", readwrite);
    const store = tx.objectStore("solutions");
    const idx = store.index("totalTimeIDX");
    const request = idx.getAll();
    let data;
    
    request.onsuccess = e => {
        data = e.target.result;
        solutionsSorted = data;
        
        for (let i = ind; i < data.length; i++) {
            let t = solutionsUnsorted[i];
            let ao3 = getAvgSorted(i, 3);
            let ao5 = getAvgSorted(i, 5);
            let ao12 = getAvgSorted(i, 12);
            let ao25 = getAvgSorted(i, 25);
            let ao50 = getAvgSorted(i, 50);
            let ao100 = getAvgSorted(i, 100);
            let ao200 = getAvgSorted(i, 200);
            let ao500 = getAvgSorted(i, 500);
            let ao1000 = getAvgSorted(i, 1000);
            let ao2000 = getAvgSorted(i, 2000);
            let ao5000 = getAvgSorted(i, 5000);
            let ao10000 = getAvgSorted(i, 10000);
            let sol = {
                time: t.time,
                scramble: t.scramble,
                penalty: t.penalty,
                comment: t.comment,
                date: t.date,
                totalTime: t.totalTime,
                index: t.index,
                caseID: t.caseID,
                ao3: ao3,
                ao5: ao5,
                ao12: ao12,
                ao25: ao25,
                ao50: ao50,
                ao100: ao100,
                ao200: ao200,
                ao500: ao500,
                ao1000: ao1000,
                ao2000: ao2000,
                ao5000: ao5000,
                ao10000: ao10000
            };
            store.put(sol, t.index);
        }

        for (let n of avgList) {
            getBestAvgFromDB(n, n === avgList[avgList.length - 1]);
        }
    }

    request.onerror = e => {
        console.log(e);
    }
}

function getBestAvgFromDB(n, last) {
    const tx = db.transaction("solutions", readonly);
    const store = tx.objectStore("solutions");
    const idx = store.index("ao" + n + "IDX");
    const request = idx.getAll();
    let data;
    
    request.onsuccess = e => {
        data = e.target.result;
        if (data[0]) {
            let b = data[0]["ao" + n];
            let i = data[0]["index"];
            averages["best"][n] = b === "-" ? "DNF" : b;
            averages["bestLastIDX"][n] = b === "-" ? (n - 1) : i;
        }
        if (last) {
            updateStats();
        }
    }

    request.onerror = e => {
        console.log(e);
    }
}