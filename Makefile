proto-gen:
	npx protoc \
		--ts_proto_out=src/protobuf/chat \
		--ts_proto_opt=nestJs=true,outputServices=grpc-js \
		-I=src/proto \
		src/proto/chat.proto
	npx protoc \
		--ts_proto_out=src/protobuf/user \
		--ts_proto_opt=nestJs=true,outputServices=grpc-js \
		-I=src/proto \
		src/proto/user.proto