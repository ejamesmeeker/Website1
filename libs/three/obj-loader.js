/**
 * @author
 * Adapted for non-module usage (UMD pattern), compatible with Three.js r158+
 * BufferGeometry-based OBJLoader
 */

THREE.OBJLoader = (function () {

	function ParserState() {
		var state = {
			objects: [],
			object: {},
			materialLibraries: [],
			startObject: function (name) {
				this.object = {
					name: name || '',
					geometry: {
						vertices: [],
						normals: [],
						uvs: [],
						indices: [],
					},
					mesh: null,
				};
				this.objects.push(this.object);
			}
		};
		state.startObject();
		return state;
	}

	function OBJLoader(manager) {
		this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
	}

	OBJLoader.prototype = {

		constructor: OBJLoader,

		load: function (url, onLoad, onProgress, onError) {
			const scope = this;
			const loader = new THREE.FileLoader(scope.manager);
			loader.setPath(scope.path || '');
			loader.setRequestHeader(scope.requestHeader || {});
			loader.setWithCredentials(scope.withCredentials || false);
			loader.load(url, function (text) {
				onLoad(scope.parse(text));
			}, onProgress, onError);
		},

		parse: function (text) {
			const state = new ParserState();
			const lines = text.split('\n');

			for (let i = 0; i < lines.length; i++) {
				let line = lines[i].trim();
				if (line.length === 0 || line.charAt(0) === '#') continue;

				const parts = line.split(/\s+/);
				const keyword = parts.shift();

				switch (keyword) {
					case 'v':
						state.object.geometry.vertices.push(parts.map(Number));
						break;
					case 'vn':
						state.object.geometry.normals.push(parts.map(Number));
						break;
					case 'vt':
						state.object.geometry.uvs.push(parts.map(Number));
						break;
					case 'f':
						const v = parts.map(part => part.split('/').map(str => parseInt(str) || 0));
						if (v.length < 3) continue;

						for (let j = 1; j < v.length - 1; j++) {
							state.object.geometry.indices.push([
								v[0][0], v[1][0], v[j + 1][0]
							]);
						}
						break;
				}
			}

			const group = new THREE.Group();

			state.objects.forEach((obj) => {
				const geom = new THREE.BufferGeometry();

				const verts = obj.geometry.vertices;
				const indices = obj.geometry.indices;

				const positionArray = [];
				verts.forEach(v => positionArray.push(...v));

				const indexArray = [];
				indices.forEach(i => indexArray.push(...i.map(x => x - 1)));

				geom.setAttribute('position', new THREE.Float32BufferAttribute(positionArray, 3));
				geom.setIndex(indexArray);
				geom.computeVertexNormals();

				const mesh = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
				group.add(mesh);
			});

			return group;
		}
	};

	return OBJLoader;

})();
