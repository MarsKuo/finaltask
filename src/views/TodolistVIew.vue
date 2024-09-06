<template>
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm"><a href="#"><span>王小明的代辦</span></a></li>
        <li><a href="#" @click.prevent="signout">登出</a></li>
      </ul>
    </nav>
    <div class="conatiner todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodo">
          <a href="#" @click.prevent="addTodo">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div class="todoList_list" v-if="todos.length > 0">
          <ul class="todoList_tab">
            <li><a href="#" :class="activeType === '1' ? 'active' : ''" @click.prevent="changeType('1')">全部</a></li>
            <li><a href="#" :class="activeType === '2' ? 'active' : ''" @click.prevent="changeType('2')">待完成</a></li>
            <li><a href="#" :class="activeType === '3' ? 'active' : ''" @click.prevent="changeType('3')">已完成</a></li>
          </ul>
          <!-- 已完成 -->
          <div class="todoList_items" v-show="activeType === '1'">
            <ul class="todoList_item">
              <li v-for="todo in type1" :key="todo.id">
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" :checked="todo.status" @click="changeStatus(todo.id)">
                  <span>{{ todo.content }}</span>
                </label>
                <a href="#" @click.prevent="deleteTodo(todo.id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>

            </ul>
            <div class="todoList_statistics">
              <p>{{ type2Count }} 個待完成項目</p>
            </div>
          </div>
          <div class="todoList_items" v-show="activeType === '2'">
            <ul class="todoList_item">
              <li v-for="todo in type2" :key="todo.id">
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" :checked="todo.status" @click="changeStatus(todo.id)">
                  <span>{{ todo.content }}</span>
                </label>
                <a href="#" @click.prevent="deleteTodo(todo.id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ type2Count }} 個待完成項目</p>
            </div>
          </div>
          <div class="todoList_items" v-show="activeType === '3'">
            <ul class="todoList_item">

              <li v-for="todo in type3" :key="todo.id">
                <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" value="true" :checked="todo.status" @click="changeStatus(todo.id)">
                  <span>{{ todo.content }}</span>
                </label>
                <a href="#" @click.prevent="deleteTodo(todo.id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>

            </ul>
            <div class="todoList_statistics">
              <p> {{ type3Count }} 個已完成項目</p>
            </div>
          </div>
        </div>
        <div v-else>
          目前尚無待辦事項
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
const apiUrl = "https://todolist-api.hexschool.io";
import Swal from 'sweetalert2'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'

const token = ref('');
const router = useRouter()
const uid = ref('');

//從cookie中取得token
const TodoToken = document.cookie
  .split('; ')
  .find((row) => row.startsWith('hexschoolTodo='))
  ?.split('=')[1];

onMounted(async () => {
  if (TodoToken) {
    token.value = TodoToken;
    try {
      const response = await axios.get(`${apiUrl}/users/checkout`, {
        headers: {
          Authorization: `${token.value}`
        }
      })
      uid.value = response.data.uid
      getTodoList();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: '登入逾時，即將為您導回登入頁',
        text: "Something went wrong!",
        showConfirmButton: false,
        timer: 1500
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }

  } else {
    Swal.fire({
      icon: "error",
      title: '登入逾時，即將為您導回登入頁',
      text: "Something went wrong!",
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }
});

//登出
const signout = async () => {
  try {
    await axios.post(`${apiUrl}/users/sign_out`, {}, {
      headers: {
        Authorization: `${token.value}`
      }
    })
    //刪除cookie
    document.cookie = `hexschoolTodo=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    Swal.fire({
      position: "center",
      icon: "success",
      title: "登出成功，即將為您導回登入頁",
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    Swal.fire({
      position: "center",
      icon: "danger",
      title: "登出失敗",
      showConfirmButton: false,
      timer: 1500
    });

  }
}

const activeType = ref('1');
const changeType = (type) => {
  activeType.value = type;
}


const todos = ref([]);
const newTodo = ref('');


const addTodo = async () => {
  if (!newTodo.value) return;

  const todo = {
    content: newTodo.value,
  };
  try {
    const response = await axios.post(`${apiUrl}/todos`, todo, {
      headers: {
        Authorization: `${token.value}`
      }
    })
    console.log('11', response);
    getTodoList();
    newTodo.value = '';
    Swal.fire({
      position: "center",
      icon: "success",
      title: "新增成功",
      showConfirmButton: false,
      timer: 1000
    });
  } catch (error) {
    console.log(error);
  }
}



const getTodoList = async () => {
  try {
    const response = await axios.get(`${apiUrl}/todos`, {
      headers: {
        Authorization: `${token.value}`
      }
    })
    console.log(response);
    todos.value = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

//全部
const type1 = computed(() => {
  return todos.value
})
const type1Count = computed(() => {
  return todos.value.length
})
//完成
const type2 = computed(() => {
  return todos.value.filter(item => item.status === false)
})
const type2Count = computed(() => {
  return todos.value.filter(item => item.status === false).length
})
const type3 = computed(() => {
  return todos.value.filter(item => item.status === true)
})
const type3Count = computed(() => {
  return todos.value.filter(item => item.status === true).length
})


const changeStatus = async (id) => {
  await axios.patch(
    `${apiUrl}/todos/${id}/toggle`,
    {},
    {
      headers: {
        Authorization: token.value,
      },
    }
  );
  getTodoList();
}
const deleteTodo = async (id) => {
  await axios.delete(`${apiUrl}/todos/${id}`, {
    headers: {
      Authorization: token.value,
    },
  });
  getTodoList();
  Swal.fire({
    position: "center",
    icon: "success",
    title: "刪除成功",
    showConfirmButton: false,
    timer: 1000
  });
};

</script>